import User from "../models/user";
import Letter from "../models/letter";


export const makeLetter = async (req, res) => {
    console.log("\nthis is where the error occurs\n");
    console.log(req.body);
    try {
        const { text, recipientID, themeID, fontID, senderID, status } = req.body;        

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

        // add letter to db
        try {
            const letter = await new Letter({
                sender: senderID,
                recipient: recipientID,
                text: text,
                status: status,
                theme: themeID,
                font: fontID,
            }).save();

            return res.json({
                letterID: letter._id
            });
        } catch (err) {
            console.log(err);
        }

    } catch (err) {
        console.log(err);
        return res.status(400).send("Error. Try again.");
    }
};


export const matchRecipient = async (req, res) => {
    try {
        const { senderID, newText } = req.body;
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
                error: "No user found that matches recipient",
            });
        }

        return res.json({
            matchingUsers: recipients
        });

    } catch (err) {
        console.log(err);
        return res.status(400).send("Error. Try again.");
    }
};
