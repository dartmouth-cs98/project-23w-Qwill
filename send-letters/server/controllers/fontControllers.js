import User from "../schemas/userSchema";
import Font from "../schemas/fontSchema";
require("dotenv").config();


/**
 * POST /api/createCustomFont
 * Creates a custom font from a handwriting image and stores it in Firebase and MongoDB
 *
 * Request body: { userID: String, handwritingImage: String (Base64 format) }
 * Response: { message: String, font: Font object } || { message: String } || { error: String }
 * 
 * This controller generates a custom font based on the user's handwriting from the provided image
 * It spawns a new Python process that takes in the handwriting image, and outputs a TrueType font (TTF) file
 * The TTF file is then uploaded to Firebase Storage, and a new Font record is created in MongoDB
 * The controller returns a success response with the created font if everything is successful
 * If any error occurs during the process, it sends a response with the error message
 * Specific error codes from the Python process (described in the README) are handled with predefined messages
 */
export const createCustomFont = async (req, res) => {
    // Initialize an error dictionary that maps potential python exit codes with their corresponding error messages to sent to user
    const ERROR_DICT = {
        50: "Unable to connect to Google Cloud Vision. Servers may be down.",
        51: "Unable to detect handwriting in text. Make sure photo quality is high and to follow the instructions carefully.",
        52: "Unable to cut image into individual .png images.",
        53: "Unable to convert .png images of each character into the .svg format.",
        54: "Unable to convert .svg files into a .ttf font file",
        55: "Error sending generated font file back to server"
    };

    try {
        const { userID, handwritingImage } = req.body;        

        // check if our db has user with the ID of the user
        const user = await User.findOne({
            "_id": userID
        });
        if (!user) {
            return res.json({
                error: "No user found with the userID",
            });
        }

        // Create a new Python process to generate the ttf file
        const spawn = require("child_process").spawn;
        const pythonProcess = spawn('python3', ["./handwriting/scripts/main.py", user.username, user.numCustomFonts], {
            stdio: ['pipe', 'pipe', 'pipe']
        });

        // write base64image to stdin
        pythonProcess.stdin.write(handwritingImage);
        pythonProcess.stdin.end();
        
        // Accumulate output and/or error messages from stdout/stderr to log on close
        let output = "";
        let errorMessage = null;

        // Handle output from the running of the Python process
        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
        });

        // Handle errors from the running of the Python process
        pythonProcess.stderr.on('data', (data) => {
            errorMessage = data.toString('utf-8').trim();
            console.log(errorMessage);
        });

        // Handle the end of the Python process
        pythonProcess.on('close', async (exitCode) => {
            // Check the exit code to see if the process completed successfully
            if (exitCode === 0) {
                // Convert base64 file content to a buffer
                const fileContent = Buffer.from(output, 'base64')
                // const fontName = user.username + "-font-" + (user.numCustomFonts+1).toString();
                const fontName = "my-font-" + (user.numCustomFonts+1).toString();
                const filePath = user.username + '/' + fontName + ".ttf";

                var admin = require("firebase-admin");
                const firebaseConfig = require('../qwill-f4d12-firebase-adminsdk-ui2xj-586a2fbd91.json');

                if (!admin.apps.length) {
                    admin.initializeApp({
                        credential: admin.credential.cert(firebaseConfig, "Qwill backend"),
                        storageBucket: "qwill-f4d12.appspot.com"
                    });
                } 

                // Get a reference to the file in the Firebase Storage service
                var storage = admin.storage();
                var fileRef = storage.bucket().file(filePath);
                  
                // Upload the file to Firebase Storage
                fileRef.save(fileContent, {
                    metadata: {
                        contentType: "font/ttf"
                    }
                }).then(function() {                  
                    // Generate a download URL for the uploaded file
                    fileRef.getSignedUrl({
                        action: "read",
                        expires: "03-17-2035"
                    }).then(async function(downloadURL) {
                        try {
                            // Add font to db
                            const font = await new Font({
                                creator: userID,
                                name: fontName,
                                firebaseDownloadLink: downloadURL[0],
                                firebaseFilePath: filePath,
                                isDeleted: false,
                            }).save();
        
                            // Update number of custom fonts for the user
                            await User.updateOne(
                                { 'username': user.username }, 
                                { 'numCustomFonts': user.numCustomFonts+1 }
                            );
                            
                            return res.json({
                                message: "Congrats, your font has been made!",
                                font: font
                            });
        
                        } catch (err) {
                            console.log(err);
                        }

                    }).catch(function(error) {
                        console.log("Error generating download URL:", error);
                    });
                }).catch(function(error) {
                    console.log("Error uploading file:", error);
                });

            // Handle tracked exit errors from Python process defined in ERROR_DICT and return corresponding message
            } else if (exitCode in ERROR_DICT) {
                return res.json({
                    message: ERROR_DICT[exitCode]
                });            
            
            // Handle untracked errors caused during the Python execution
            } else {
                console.error(`Child process exited with code ${exitCode}`);
                console.log(errorMessage);
                return res.status(500).send(errorMessage || 'An error occurred while processing the image.');
            }
        });

        // Handle errors from spawning the Python process
        pythonProcess.on('error', (err) => {
            console.error(err);
            return res.status(500).send('An error occurred while spawning the python process.');
        });

    } catch (err) {
        console.error(err);
        return res.status(400).send("Error. Try again.");
    }
};


/**
 * POST /api/fetchCustomFonts
 * Fetches all custom fonts created by a specific user
 *
 * Request body: { userID: String }
 * Response: { createdFonts: Array of Fonts } || { error: String }
 */
export const fetchCustomFonts = async (req, res) => {
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

        // define query 
        const query = [
            {
               $match: {
                    creator: new mongoose.Types.ObjectId(user._id), 
                    isDeleted: false,
                }
            },
        ];
        const cursor = Font.aggregate(query);

        // build the list of created fonts
        var createdFonts = [];
        for await (const doc of cursor) {
            createdFonts.push(doc);
        }

        return res.json({
            createdFonts: createdFonts
        });


    } catch (err) {
        console.error(err);
        return res.status(400).send("Error. Try again.");
    }
};


/**
 * POST /api/deleteFont
 * Marks a font as deleted in the database based on the request body
 * Note: this hides the font from the user who created it, but it still exists for old letters
 *
 * Request body: { fontID: String }
 * Response: { ok: Boolean } || { error: String }
 */
export const deleteFont = async (req, res) => {  
    try {
        const { fontID } = req.body;

        // check if our db has a font with the ID of the recipient
        const font = await Font.findOne({
            "_id": fontID
        });
        if (!font) {
            return res.json({
                error: "No font found with fontID",
            });
        }

        // update the isDeleted boolean of font to true
        try {
            const resp = await Font.updateOne(
                {'_id': fontID},
                {'isDeleted': true}
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
 * POST /api/updateFontName
 * Updates the name of a font in the database based on the request body
 *
 * Request body: { fontID: String, newName: String }
 * Response: { ok: Boolean } || { error: String }
 */
export const updateFontName = async (req, res) => {  
    try {
        const { fontID, newName } = req.body;

        // check if our db has a font with the fontID
        const font = await Font.findOne({
            "_id": fontID
        });
        if (!font) {
            return res.json({
                error: "No font found with fontID",
            });
        }

        // check to make sure font name doesn't already exist for user
        const fontCheck = await Font.findOne({
            "creator": font.creator,
            "name": newName,
        });
        if (fontCheck) {
            return res.json({
                error: "font with new name already exists",
            });
        }

        // update the name of font to the new name
        try {
            const resp = await Font.updateOne(
                {'_id': fontID},
                {'name': newName}
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
