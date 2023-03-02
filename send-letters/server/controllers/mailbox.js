import User from "../models/user";
import Letter from "../models/letter";

export const receiveLetters = async (req, res) => {
    var mongoose = require('mongoose');

    try {
        const { userID } = req.body;

        // check if our db has a user with the ID of the recipient
        const user = await User.findOne({
            '_id': userID
        });
        if (!user) {
            return res.json({
                error: "No user found with userID",
            });
        }

        // define query (lookup is equivalent of a left join)
        const query = [
            {
               $match: { 
                    'recipient': new mongoose.Types.ObjectId(user._id), 
                    '$or': [
                        { 'status': "sent" },
                        { 'status': "read" }
                    ]
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

        // build the list of received letters
        var receivedLetters = [];
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


export const updateLetterStatus = async (req, res) => {    
    console.log("inside letter status update");
    try {
        const { letterID, newStatus } = req.body;
        console.log(letterID);

        // check if our db has a letter with the ID of the recipient
        const letter = await Letter.findOne({
            "_id": letterID
        });
        if (!letter) {
            return res.json({
                error: "No letter found with letterID",
            });
        }

        // update the status of letter to archive
        try {
            const resp = await Letter.updateOne(
                {'_id': letterID},
                {'status': newStatus}
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

