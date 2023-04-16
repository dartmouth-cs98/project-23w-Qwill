import User from "../schemas/userSchema";
import Friend from "../schemas/friendSchema";


export const matchUser = async (req, res) => {
    try {
        // senderID of the request, the text to match, and whether to match friends or non-friends
        const { senderID, newText, friends } = req.body;
        const recipientField = newText;

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
        const recipients = await User.find({
            '$or': [
                { 'username': { '$regex': "^"+recipientField, $options:'i' } },
                { 'name': { '$regex': "^"+recipientField, $options:'i' } }
            ]
        });

        if (!recipients) {
            return res.json({
                matchingUsers: recipients
            });
        }

        const matchingUsers = [];
        for (const recipient of recipients) {

            const friend = await Friend.findOne({
                '$or': [
                    {
                        "friendReqSender": recipient._id,
                        "friendReqReceiver": senderID,
                    },
                    {
                        "friendReqSender": senderID,
                        "friendReqReceiver": recipient._id,
                    },
                ]
            });

            // add only matching users that are friends
            if (friends) {
                if (friend && friend.status == "friends") {
                    matchingUsers.push(recipient);
                }
            // add only matching users which are not friends (no history or only request)
            } else {
                if (!friend || (friend && friend.status == "pending")) {
                    if (friend) {
                        recipient["friendStatus"] = "pending";
                    }
                    matchingUsers.push(recipient);
                } 
            }
        }


        //
        // for (const recipient of recipients) {
        //     console.log(recipient);
        // }

        // for (const user of matchingUsers) {
        //     console.log(user);
        // }
        //


        return res.json({
            matchingUsers: recipients
        });

    } catch (err) {
        console.log(err);
        return res.status(400).send("Error. Try again.");
    }
};
