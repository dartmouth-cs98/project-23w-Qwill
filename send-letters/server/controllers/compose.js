import User from "../models/user";
import Letter from "../models/letter";


export const compose = async (req, res) => {
    console.log("\n\n");
    try {
        const { senderID, recipientID, text } = req.body;

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
            "username": recipientID
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
            }).save();
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
