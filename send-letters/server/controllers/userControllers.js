import User from "../schemas/userSchema";
import Friend from "../schemas/friendSchema";


export const matchUsers = async (req, res) => {
    try {
        // senderID of the request, the text to match, and whether to match the non-friends, pending friends, and friends
        // hide incoming does not return incoming requests for the add friends screen
        const { senderID, textToMatch="", nonFriends=false, pendingFriends=false, friends=false, hideIncoming=false, returnSelf=false } = req.body;
        
        // check if our db has user with the ID of the sender
        const sender = await User.findOne({
            "_id": senderID
        });
        if (!sender) {
            return res.json({
                error: "No user found with the senderID",
            });
        }

        // check if our db has user with the ID of the recipient
        const matchedUsers = await User.find({
            '$or': [
                { 'username': { '$regex': "^"+textToMatch, $options:'i' } },
                { 'name': { '$regex': "^"+textToMatch, $options:'i' } }
            ]
        });
        if (!matchedUsers) {
            return res.json({
                matchedUsers: []
            });
        }

        // run a query to determine relationships between the sender of the request and other users
        var mongoose = require('mongoose');
        var senderID_object = mongoose.Types.ObjectId(senderID);
        const query = [
            // match all users in the DB who have usernames OR names matching the given text
            // we don't want to fetch the sender of the request as the sender is handled separately
            {
               $match: {
                    $or: [
                        { 'username': { '$regex': "^"+textToMatch, $options:'i' } },
                        { 'name': { '$regex': "^"+textToMatch, $options:'i' } }
                    ],
                    '_id': { $ne: senderID_object }
                }
            },
            // perform a left join on the friends table to receive all friends for each matching user
            //   two conditions: the matching user sent the friend request OR the matching user received the request
            {
                $lookup: {
                    from: "friends",
                    let: { id: "$_id" },
                    pipeline: [ {
                       $match: {
                          $expr: {
                             $or: [
                                { $eq: [ "$$id", "$friendReqSender" ] },
                                { $eq: [ "$$id", "$friendReqRecipient" ] }
                             ]
                          }
                       }
                    } ],
                    as: "friendsList"
                 }
            },
            // project the fields that are necesary on the frontend
            // from the User Schema: "_id", "name", "username"
            // from the joined Friends Schema: filter all friends in which the user 
            //   was either the friend request sender or friend request recipient
            {
                $project: {
                    "_id": 1,
                    "name": 1,
                    "username": 1,
                    "friendsList": {
                        $filter: {
                            input: "$friendsList",
                            as: "friendItem",
                            cond: {
                                $or: [
                                    { $eq: ['$$friendItem.friendReqRecipient', senderID_object] },
                                    { $eq: ['$$friendItem.friendReqSender', senderID_object] }
                                ]
                            }
                        }
                    }
                }
            },
            // unwind the array; there should only be one friend request between the two users so unwinding
            //  should not poduce additional documents unless the matchedUser is the user themself
            { 
                $unwind: {
                    "path": "$friendsList",
                    "preserveNullAndEmptyArrays": true
                } 
            },
            // use add field and project to rename "friendsList" to "friend" now that the field is unwinded
            { $addFields: { "friend": "$friendsList" } },
            { $project: { "friendsList": 0 } },
        ];
        const cursor = User.aggregate(query);

        // build the list of incoming friend requests
        let userFriends = [];
        for await (const matchedUser of cursor) {
            // frontend should only store 250 documents at a time to prevent lag
            if (userFriends.length >= 250) {
                break;
            }

            // check for non-friends
            if (nonFriends) {
                if (!matchedUser.friend) {
                    matchedUser["friendStatus"] = "non-friends";
                    delete matchedUser["friend"];
                    userFriends.push(matchedUser);
                }
            }
            // check for pending friends
            if (pendingFriends) {
                if (matchedUser.friend && matchedUser.friend.status == "pending") {
                    if (matchedUser.friend.friendReqSender == senderID) {
                        matchedUser["friendStatus"] = "request sent";
                        delete matchedUser["friend"];
                        userFriends.push(matchedUser);
                    } else if (matchedUser.friend.friendReqRecipient == senderID && !hideIncoming) {
                        matchedUser["friendStatus"] = "request received";
                        delete matchedUser["friend"];
                        userFriends.push(matchedUser);                    
                    }
                }
            }
            // check for friends
            if (friends) {
                if (matchedUser.friend && matchedUser.friend.status == "friends") {
                    matchedUser["friendStatus"] = "friends";
                    delete matchedUser["friend"];
                    userFriends.push(matchedUser);
                }
            }
        }

        // check if user should be returned
        if (returnSelf) {
            if (sender.name.includes(textToMatch) || sender.username.includes(textToMatch)) {
                userFriends.push({
                    "_id": senderID,
                    "name": sender.name,
                    "username": sender.username,
                    "friendStatus": "self"
                });
            }
        }
        
        // return the list of matching friends (and their corresponding friend status) to the user
        return res.json({
            matchingUsers: userFriends
        });

    } catch (err) {
        console.log(err);
        return res.status(400).send("Error. Try again.");
    }
};


export const sendFriendRequest = async (req, res) => {
    try {
        const { senderID, recipientID } = req.body;        

        // check if attempting to send request to self
        if (senderID == recipientID) {
            return res.json({
                error: "You may not send a friend request to yourself",
            });
        }

        // check if our db has user with the ID of the sender
        const sender = await User.findOne({
            "_id": senderID
        });
        if (!sender) {
            return res.json({
                error: "No user found with the senderID",
            });
        }

        // check if our db has user with the ID of the recipient
        const recipient = await User.findOne({
            "_id": recipientID
        });
        if (!recipient) {
            return res.json({
                error: "No user found with recipientID",
            });
        }

        // add friend request to db
        try {
            const friendReq = await new Friend({
                friendReqSender: senderID,
                friendReqRecipient: recipientID,
                status: "pending",
            }).save();

            return res.json({
                friendReqID: friendReq._id
            });
        } catch (err) {
            console.log(err);
        }

    } catch (err) {
        console.log(err);
        return res.status(400).send("Error. Try again.");
    }
};


export const acceptFriendRequest = async (req, res) => {
    try {
        const { friendReqID } = req.body;        

        // check if our db has user with the ID of the sender
        const friendReq = await Friend.findOne({
            "_id": friendReqID
        });
        if (!friendReq) {
            return res.json({
                error: "No friend request found with the friendReqID",
            });
        }

        try {
            const resp = await Friend.updateOne(
                {'_id': friendReqID},
                {'status': "friends"}
            );

            return res.json({
                ok: true
            });
        } catch (err) {
            console.log(err);
        }
        

    } catch (err) {
        console.log(err);
        return res.status(400).send("Error. Try again.");
    }
};


export const declineFriendRequest = async (req, res) => {
    try {
        const { friendReqID } = req.body;        

        // check if our db has user with the ID of the sender
        const friendReq = await Friend.findOne({
            "_id": friendReqID
        });
        if (!friendReq) {
            return res.json({
                error: "No friend request found with the friendReqID",
            });
        }

        try {
            const resp = await Friend.deleteOne(
                {'_id': friendReqID}
            );

            return res.json({
                ok: true
            });
        } catch (err) {
            console.log(err);
        }
        

    } catch (err) {
        console.log(err);
        return res.status(400).send("Error. Try again.");
    }
};


/**
 * This function takes in the ID of the user and returns a JSON file containing
 *   all incoming friend requests from the mongo Friends collection
 * @param userID The ID of the user from the mongo user collection
 */
export const getIncomingFriendReqs = async (req, res) => {
    var mongoose = require('mongoose');

    try {
        const { userID } = req.body;  

        // check if our db has user with the ID of the user
        const user = await User.findOne({
            "_id": userID
        });
        if (!user) {
            return res.json({
                error: "No user found with the userID",
            });
        }

        // define query (lookup is equivalent of a left join)
        const query = [
            {
               $match: {
                    "friendReqRecipient": new mongoose.Types.ObjectId(user._id), 
                    "status": "pending",
                }
            },
            {
                $lookup: {
                    from: "users", 
                    localField: "friendReqSender",
                    foreignField: "_id",
                    as: "requesterInfo"
                }
            },
            { 
                $unwind: "$requesterInfo"
            },
            {
                $limit : 250
            }
        ];
        const cursor = Friend.aggregate(query);

        // build the list of incoming friend requests
        let incomingFriendReqs = [];
        for await (const doc of cursor) {
            incomingFriendReqs.push(doc);
        }

        return res.json({
            incomingFriendReqs: incomingFriendReqs
        });
        

    } catch (err) {
        console.log(err);
        return res.status(400).send("Error. Try again.");
    }
};
