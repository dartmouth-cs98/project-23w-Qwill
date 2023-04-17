import User from "../schemas/userSchema";
import Friend from "../schemas/friendSchema";


export const matchUsers = async (req, res) => {
    try {
        // senderID of the request, the text to match, and whether to match the non-friends, pending friends, and friends
        const { senderID, textToMatch="", nonFriends=false, pendingFriends=false, friends=false } = req.body;

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

        // 
        const filteredUsers = [];
        for (let matchedUser of matchedUsers) {
            matchedUser = matchedUser.toJSON(); // convert to JSON for easy manipulation

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
                    } else {
                        matchedUser["friendStatus"] = "request received";
                    }
                    filteredUsers.push(matchedUser);
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


        //
        // for (const matchedUser of matchedUsers) {
        //     console.log(matchedUser);
        // }

        // for (const user of filteredUsers) {
        //     console.log(user.username);
        //     console.log(user.friendStatus);
        //     console.log("");
        // }
        


        return res.json({
            // matchingUsers: matchedUsers
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