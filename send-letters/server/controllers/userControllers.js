import User from "../schemas/userSchema";
import Friend from "../schemas/friendSchema";
import Letter from "../schemas/letterSchema";
import Font from "../schemas/fontSchema";


/**
 * POST /api/matchUsers
 * Matches users based on the given text in the request body, filtering for non-friends, pending friends, friends, and self
 * 
 * Request body: { senderID: String, textToMatch: String, nonFriends: Boolean, pendingFriends: Boolean, friends: Boolean, hideIncoming: Boolean, returnSelf: Boolean }
 * Response: { matchingUsers: Array } || { error: String }
 * 
 * This controller matches users based on the given the case insensitive text (textToMatch). It returns an array of user objects that have a username 
 *   or name that starts with the given text. It filters the returned user objects based on whether the match is themself, non-friends, pending friends,
 *   or friends with the user sending the request (senderID). The returned users include a field indicating the friend status between the sender and 
 *   the matched user. If hideIncoming is set to true, it will not return incoming friend requests.
 */
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
            //  should not poduce additional documents
            { 
                $unwind: {
                    "path": "$friendsList",
                    "preserveNullAndEmptyArrays": true
                } 
            },
            // use add field and project to rename "friendsList" to "friend" now that the field is unwinded
            { $addFields: { "friend": "$friendsList" } },
            { 
                $project: { 
                    "friendsList": 0, 
                    "friend.createdAt": 0,
                    "friend.updatedAt": 0,
                    "friend.__v": 0
                } 
            },
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
                        userFriends.push(matchedUser);
                    } else if (matchedUser.friend.friendReqRecipient == senderID && !hideIncoming) {
                        matchedUser["friendStatus"] = "request received";
                        userFriends.push(matchedUser);                    
                    }
                }
            }
            // check for friends
            if (friends) {
                if (matchedUser.friend && matchedUser.friend.status == "friends") {
                    matchedUser["friendStatus"] = "friends";
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


/**
 * POST /api/sendFriendRequest
 * Sends a friend request by creating a new entry in the MongoDB Friends collection
 * 
 * Request body: { senderID: String, recipientID: String }
 * Response: { friendReqID: String } || { error: String }
 */
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

        // check if friend request already exists
        const friendCheck = await Friend.findOne({
            "friendReqSender": senderID,
            "friendReqRecipient": recipientID
        });
        if (friendCheck) {
            return res.json({
                error: "friend request already sent",
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


/**
 * POST /api/acceptFriendRequest
 * Accepts a friend request by updating the status to "friends"
 * 
 * Request body: { friendReqID: String }
 * Response: { ok: Boolean } || { error: String }
 */
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
                { '_id': friendReqID },
                { 'status': "friends" }
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
 * POST /api/deleteFriendRequest
 * Deletes a friend request from the MongoDB Friends collection
 * 
 * Request body: { friendReqID: String }
 * Response: { ok: Boolean } || { error: String }
 */
export const deleteFriendRequest = async (req, res) => {
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
 * POST /api/getIncomingFriendReqs
 * Retrieves all pending friend requests for a specific user (limit of 250)
 * 
 * Request body: { userID: String }
 * Response: { incomingFriendReqs: Array } || { error: String }
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
                $sort: { "createdAt": -1 },
            },
            {
                $project: {
                    "_id": 1,
                    "friendReqRecipient": 1,
                    "friendReqSender": 1,
                    "requesterInfo._id": 1,
                    "requesterInfo.name": 1,
                    "requesterInfo.username": 1
                }
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


/**
 * POST /api/countUserStats
 * Counts and returns number of letters sent, letters received, and fonts created by a specific user
 *   Note: Only letters with a status of "sent", "read", or "archive" are included in the counts
 * 
 * Request body: { userID: String }
 * Response: { numLettersSent: Number, numLettersReceived: Number, numFontsCreated: Number } || { error: String }
 */
export const countUserStats = async (req, res) => {
    try {
        const { userID } = req.body;        

        // check if our db has user with the ID of the sender
        const user = await User.findOne({
            "_id": userID
        });
        if (!user) {
            return res.json({
                error: "No friend request found with the userID",
            });
        }

        try {
            const lettersSentCount = await Letter.countDocuments(
                {
                    'sender': userID,
                    $or: [
                        { 'status': "sent" }, 
                        { 'status': "read" },
                        { 'status': "archive" },
                    ],
                }
            );

            const lettersReceivedCount = await Letter.countDocuments(
                {
                    'recipient': userID,
                    $or: [
                        { 'status': "sent" }, 
                        { 'status': "read" },
                        { 'status': "archive" },
                    ],
                }
            );

            const fontsCreatedCount = await Font.countDocuments(
                { 'creator': userID }
            );

            return res.json({
                numLettersSent: lettersSentCount,
                numLettersReceived: lettersReceivedCount,
                numFontsCreated: fontsCreatedCount
            });
        } catch (err) {
            console.log(err);
        }
        

    } catch (err) {
        console.log(err);
        return res.status(400).send("Error. Try again.");
    }
};
