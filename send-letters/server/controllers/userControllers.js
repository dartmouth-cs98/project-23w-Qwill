import User from "../schemas/userSchema";
import Friend from "../schemas/friendSchema";


export const matchUsers = async (req, res) => {
    try {
        // senderID of the request, the text to match, and whether to match the non-friends, pending friends, and friends
        // hide incoming does not return incoming requests for the add friends screen
        const { senderID, textToMatch="", nonFriends=false, pendingFriends=false, friends=false, hideIncoming=false } = req.body;

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



        
        const start = Date.now();
        
        var mongoose = require('mongoose');
        var senderID_object = mongoose.Types.ObjectId(senderID);

        const query = [
            // match all users in the DB who have usernames OR names matching the given text
            {
               $match: {
                    $or: [
                        { 'username': { '$regex': "^"+textToMatch, $options:'i' } },
                        { 'name': { '$regex': "^"+textToMatch, $options:'i' } }
                    ]
                }
            },
            // perform a left join on the friends table to receive all friends for each matching user
            {
                $lookup: {
                    from: "friends", 
                    localField: "_id",
                    foreignField: "friendReqSender",
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
            //  should not poduce additional documents
            {
                $unwind: "$friendsList"
            },
            // use add field and project to rename "friendsList" to "friend" now that the field is unwinded
            { $addFields: { "friend": "$friendsList" }},
            { $project: { "friendsList": 0 } },
            // limit the amount of matched friends to 50 to prevent slow state updates and rendering on frontend
            { 
                $limit : 50
            }
        ];
        const cursor = User.aggregate(query);

        // build the list of incoming friend requests
        let userFriends = [];
        for await (const matchedUser of cursor) {
            userFriends.push(matchedUser);
            console.log(matchedUser);
        }




        console.log(`Execution time 1: ${Date.now() - start} ms`);








        const filteredUsers = [];
        for (let matchedUser of matchedUsers) {
            matchedUser = matchedUser.toJSON(); // convert to JSON for easy manipulation
            delete matchedUser['password'];

            // get the friend status between the user and matching user
            // NOTE: friend being undefined means they are not friends and their is no pending request
            const friendStatus = await Friend.findOne({
                '$or': [
                    {
                        'friendReqSender': matchedUser._id.toString(),
                        'friendReqRecipient': senderID
                    },
                    {
                        'friendReqSender': senderID,
                        'friendReqRecipient': matchedUser._id.toString()
                    },
                ]
            });

        
            // add all matched users with that have the requested statuses
            if (nonFriends) {
                if (!friendStatus && matchedUser._id != senderID) {
                    matchedUser["friendStatus"] = "non-friends";
                    filteredUsers.push(matchedUser);
                }
            }
            if (pendingFriends) {  // need some extra magic here for who was which
                if (friendStatus && friendStatus.status == "pending") {
                    if (friendStatus.friendReqSender == senderID) {
                        matchedUser["friendStatus"] = "request sent";
                        filteredUsers.push(matchedUser);
                    } else if (friendStatus.friendReqRecipient == senderID && !hideIncoming) {
                        matchedUser["friendStatus"] = "request received";
                        filteredUsers.push(matchedUser);
                    }
                }
            }
            if (friends) {
                if (friendStatus && friendStatus.status == "friends") {
                    matchedUser["friendStatus"] = "friends";
                    filteredUsers.push(matchedUser);
                 // additional check for user self
                } else if (!friendStatus && matchedUser._id.toString() == senderID) {
                    matchedUser["friendStatus"] = "self";
                    filteredUsers.push(matchedUser);
                }
            }
        }

        console.log(`Execution time 2: ${Date.now() - start} ms`);


        return res.json({
            matchingUsers: filteredUsers
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
