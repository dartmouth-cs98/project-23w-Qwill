import User from "../models/user";
import Letter from "../models/letter";

export const receiveLetters = async (req, res) => {
    var mongoose = require('mongoose');

    try {
        const { userID } = req.body;

        // check if our db has user with the ID of the recipient
        const user = await User.findOne({
            "_id": userID
        });
        if (!user) {
            return res.json({
                error: "No user found with userID",
            });
        }

        const query = [
            {
               $match: { 
                    "recipient": new mongoose.Types.ObjectId(user._id) 
                }
            },
            {
                $lookup: {
                    from: "users", 
                    localField: "sender",
                    foreignField: "_id",
                    as: "senderInfo"
                }
            },
            { 
                $unwind: '$senderInfo' 
            },
        ];

        const cursor = Letter.aggregate(query);

        var receivedLetters = [];

        Letter.aggregate(query).cursor();
        for await (const doc of cursor) {
            receivedLetters.push(doc);
        }

        return res.json({
            receivedLetters: receivedLetters
        });

    } catch (err) {
        console.log(err);
        return res.status(400).send("Error. Try again.");
    }
};