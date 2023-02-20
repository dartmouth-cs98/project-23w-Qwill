import User from "../models/user";
import Letter from "../models/letter";

export const receiveLetters = async (req, res) => {
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

        // get all letters sent to the user
        const receivedLetters = await Letter.find({
            "recipient": user
        });
        if (!receivedLetters) {
            console.log("nothing!")
            return res.json({
                error: "No letters found that matches recipient",
            });
        }
        return res.json({
            receivedLetters: receivedLetters
        });

    } catch (err) {
        console.log(err);
        return res.status(400).send("Error. Try again.");
    }
};