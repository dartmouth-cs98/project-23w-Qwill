import User from "../schemas/userSchema";
import Letter from "../schemas/letterSchema";


/**
 * POST /api/makeLetter
 * Creates a letter in the database with the given details in the request body
 *
 * Request body: { text: String, recipientID: String, themeID: String, fontID: String, customFont: String, senderID: String, stickers: Array, status: String }
 * Response: { letterID: String } || { error: String }
 */
export const makeLetter = async (req, res) => {
    try {
        const { text, recipientID, themeID, fontID, customFont, senderID, stickers, status } = req.body;        

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
                customFont: customFont,
                stickers: stickers
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


/**
 * POST /api/fetchLetters
 * Fetches letters in the database with the given details in the request body (limit 100)
 *
 * Request body: { userID: String, possibleLetterStatuses: Array, userStatus: String }
 * Response: { receivedLetters: Array } || { error: String }
 * 
 * This controller fetches letters where the user is either the sender or recipient, based on the 'userStatus' parameter.
 *   If a user with the given ID exists in the database, it fetches all letters where the user is either the sender or 
 *   recipient, and the letter status matches any status in the 'possibleLetterStatuses' array. The fetched letters are 
 *   then returned in the response. 
 */
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
        let userInfoNeeded = "";
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
            // Match all letters with the user as either the receiver/sender (based on userStatus)
            //   and with the status being in the array of possible statuses
            {
               $match: {
                    [userStatus]: new mongoose.Types.ObjectId(user._id), 
                    '$or': letterStatusMatch
                }
            },
            // Add information on the other involved person involved in the letter to send back to user
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
            // Add 3 part query defined at bottom of script to add the font info to letters made with a custom font
            addFontInfo[0],  // Add the field `fontObjectId` for letters sent with a custom font (`addFields`)
            addFontInfo[1],  // Add necessary information about custom fonts from `fonts` collection in `customFont` field (`lookup)
            addFontInfo[2],  // Add the field `fontInfo` containing the relevant information from the `customFont` field (`addFields`)
            // Hide unecessary fields and sort by creation date
            {
                $project: {
                    fontObjectId: 0,
                    customFontInfo: 0,
                    updatedAt: 0,
                    __v: 0,
                    [userInfoNeeded+"Info.__v"]: 0,
                    [userInfoNeeded+"Info.numCustomFonts"]: 0,
                    [userInfoNeeded+"Info.email"]: 0,
                    [userInfoNeeded+"Info.password"]: 0,
                    [userInfoNeeded+"Info.createdAt"]: 0,
                    [userInfoNeeded+"Info.updatedAt"]: 0,
                    ["fontInfo.__v"]: 0,
                    ["fontInfo.createdAt"]: 0,
                    ["fontInfo.updatedAt"]: 0,
                    ["fontInfo.creator"]: 0,
                    ["fontInfo.firebaseFilePath"]: 0,
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            { 
                $limit: 100 
            }
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


/**
 * POST /api/updateLetterStatus
 * Updates the status of a letter in the database based on the request body
 *
 * Request body: { letterID: String, newStatus: String }
 * Response: { ok: Boolean } || { error: String }
 */
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


/**
 * POST /api/updateLetterInfo
 * Updates the fields of a letter in the database based on the fields in the request body
 *
 * Request body: { letterID: String, text: String, recipientID: String, themeID: String, fontID: String, customFont: String, senderID: String, stickers: Array, status: String }
 * Response: { letterID: String } || { error: String }
 */
export const updateLetterInfo = async (req, res) => {    
    try {
        // get letterID and the new values for the letter
        const { letterID, text, recipientID, themeID, fontID, customFont, senderID, stickers, status } = req.body;

        // check if our db has a letter with the ID of the recipient
        const letter = await Letter.findOne({
            "_id": letterID
        });
        if (!letter) {
            return res.json({
                error: "No letter found with letterID",
            });
        }

        // update the status of letter
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
                    'customFont': customFont,
                    'stickers': stickers
                }
            );
    
            return res.json({
                letterID: letterID
            });
        } catch (err) {
            console.log(err);
            return res.status(300).send("Error updating letter in db. Try again.");
        }

    } catch (err) {
        console.log(err);
        return res.status(400).send("Error. Try again.");
    }
};


/**
 * POST /api/deleteLetter
 * Deletes a letter from the database based on the request body
 *
 * Request body: { letterID: String }
 * Response: { ok: Boolean } || { error: String }
 */
export const deleteLetter = async (req, res) => {  
    try {
        const { letterID } = req.body;

        // check if our db has a letter with the ID of the recipient
        const letter = await Letter.findOne({
            "_id": letterID
        });
        if (!letter) {
            return res.json({
                error: "No letter found with letterID",
            });
        }

        // delete the letter from the db
        try {
            const resp = await Letter.deleteOne(
                {'_id': letterID}
            );
    
            return res.json({
                ok: true
            });
        } catch (err) {
            console.log(err);
            return res.status(300).send("Error deleting letter from db. Try again.");
        }

    } catch (err) {
        console.log(err);
        return res.status(400).send("Error. Try again.");
    }
};


/**
 * POST /api/fetchLetterHistory
 * Fetches the history of letters between two users from the database based on the request body
 *
 * Request body: { userID: String, friendID: String }
 * Response: { letterHistory: Array } || { error: String }
 * 
 * If both users are found, it finds all letters in the database between these two users provided 
 *   in the request body, excluding drafts. Each letter is appended with information about its sender 
 *   and recipient. The controller returns a response with the array of letters if the process is 
 *   successful.
 */
export const fetchLetterHistory = async (req, res) => {
    var mongoose = require('mongoose');

    try {
        const { userID, friendID } = req.body;

        // check if our db has a user with the ID of the user
        const user = await User.findOne({
            '_id': userID
        });
        if (!user) {
            return res.json({
                error: "No user found with userID",
            });
        }

        // check if our db has a user with the ID of the friend
        const friend = await User.findOne({
            '_id': friendID
        });
        if (!user) {
            return res.json({
                error: "No user found with friendID",
            });
        }

        // define query
        const query = [
            {
               $match: {
                    'status': { $ne: "draft" }, 
                    $or: [
                        {
                            'sender': new mongoose.Types.ObjectId(user._id),
                            'recipient': new mongoose.Types.ObjectId(friend._id)
                        },
                        {
                            'sender': new mongoose.Types.ObjectId(friend._id),
                            'recipient': new mongoose.Types.ObjectId(user._id)
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'users', 
                    localField: 'sender',
                    foreignField: '_id',
                    as: 'senderInfo'
                }
            },
            { $unwind: '$senderInfo' },
            {
                $lookup: {
                    from: 'users', 
                    localField: 'recipient',
                    foreignField: '_id',
                    as: 'recipientInfo'
                }
            },
            { $unwind: '$recipientInfo' },
            // Add 3 part query defined at bottom of script to add the font info to letters made with a custom font
            addFontInfo[0],  // Add the field `fontObjectId` for letters sent with a custom font (`addFields`)
            addFontInfo[1],  // Add necessary information about custom fonts from `fonts` collection in `customFont` field (`lookup)
            addFontInfo[2],  // Add the field `fontInfo` containing the relevant information from the `customFont` field (`addFields`)
            {
                $project: { 
                    '_id': 1,
                    'sender': 1,
                    'recipient': 1,
                    'text': 1,
                    'status': 1,
                    'theme': 1,
                    'font': 1,
                    'fontInfo': 1,
                    'customFont': 1,
                    'stickers': 1,
                    'createdAt': 1,
                    'senderInfo.name': 1,
                    'senderInfo.username': 1,
                    'recipientInfo.name': 1,
                    'recipientInfo.username': 1,
                    'stickers': 1,
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            { 
                $limit: 100 
            }
        ];
        const cursor = Letter.aggregate(query);

        // build the list of received letters
        var letterHistory = [];
        for await (const doc of cursor) {
            letterHistory.push(doc);
        }

        return res.json({
            letterHistory: letterHistory
        });

    } catch (err) {
        console.log(err);
        return res.status(400).send("Error. Try again.");
    }
};


const addFontInfo = [
    // Add the field `fontObjectId` for letters sent with a custom font
    {
        $addFields: {
            fontObjectId: {
                $cond: {
                    if: { $eq: ["$customFont", true] },
                    then: { $toObjectId: "$font" },
                    else: null
                }
            }
        }
    },
    // Add necessary information about custom fonts from `fonts` collection
    {
        $lookup: {
            from: "fonts",
            localField: "fontObjectId",
            foreignField: "_id",
            as: "customFontInfo"
        }
    },
    {
        $addFields: {
            fontInfo: {
                $cond: {
                    if: { $eq: ["$customFont", true] },
                    then: { $arrayElemAt: ["$customFontInfo", 0] },
                    else: null
                }
            }
        }
    },
];
