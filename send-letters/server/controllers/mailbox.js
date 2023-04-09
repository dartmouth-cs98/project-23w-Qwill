import User from "../models/user";
import Letter from "../models/letter";

export const fetchLetters = async (req, res) => {
    var mongoose = require('mongoose');

    try {
        const { userID, possibleLetterStatuses, userStatus } = req.body;

        // check if our db has a user with the ID of the recipient
        const user = await User.findOne({
            '_id': userID
        });
        if (!user) {
            return res.json({
                error: "No user found with userID",
            });
        }

        // build the list of statuses to match in the DB query
        const letterStatusMatch = [];
        for (const status of possibleLetterStatuses) {
            letterStatusMatch.push({'status': status});
        }

        // userInfoNeeded will be the opposite of the user status since the user info is already stored in context on the frontend
        var userInfoNeeded = "";
        if (userStatus == "sender") {
            userInfoNeeded = "recipient";
        } else if (userStatus == "recipient") {
            userInfoNeeded = "sender";
        } else {
            return res.json({
                error: "Only acceptable values for userStatus are \"sender\" and \"recipient\".",
            });
        }

        // define query (lookup is equivalent of a left join)
        const query = [
            {
               $match: {
                    [userStatus]: new mongoose.Types.ObjectId(user._id), 
                    '$or': letterStatusMatch
                }
            },
            {
                $lookup: {
                    from: "users", 
                    localField: userInfoNeeded,
                    foreignField: "_id",
                    as: userInfoNeeded+"Info"
                }
            },
            { 
                $unwind: "$"+userInfoNeeded+"Info"
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
    try {
        const { letterID, newStatus } = req.body;

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

export const updateLetterInfo = async (req, res) => {    
    try {
        // get letterID and the new values for the letter
        const { letterID, text, recipientID, themeID, fontID, senderID, status } = req.body;    

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
                {
                    'status': status,
                    'text': text,
                    'sender': senderID,
                    'recipient': recipientID,
                    'theme': themeID,
                    'font': fontID,
                }
            );
    
            return res.json({
                letterID: letterID
            });
        } catch (err) {
            console.log(err);
        }

    } catch (err) {
        console.log(err);
        return res.status(400).send("Error. Try again.");
    }
};
