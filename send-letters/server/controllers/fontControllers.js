import User from "../schemas/userSchema";
import Font from "../schemas/fontSchema";
require("dotenv").config();
const Dropbox = require('dropbox').Dropbox;


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
        const pythonProcess = spawn('python3', ["../server/handwriting/scripts/main.py", user.username, user.numCustomFonts], {
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
        });

        // Handle the end of the Python process
        pythonProcess.on('close', async (exitCode) => {
            // Check the exit code to see if the process completed successfully
            if (exitCode === 0) {
                // Convert base64 file content to a buffer
                const fileContent = Buffer.from(output, 'base64')
                const fontName = user.username + "-font-" + (user.numCustomFonts+1).toString();

                // Create a new Dropbox instance with the Qwill access token
                const dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });

                // Upload the font file to Dropbox
                dbx.filesUpload({
                    path: '/' + user.username + '/' + fontName + ".ttf",
                    contents: fileContent,
                })
                    .then(uploadResponse => {
                        // Get the direct download link for the uploaded file
                        dbx.sharingCreateSharedLinkWithSettings({
                            path: uploadResponse.result.path_display,
                            settings: {
                                access: "viewer",
                                allow_download: true,
                                audience: "public",
                                requested_visibility: "public"
                            }
                        })
                            .then(async (linkResponse) => {
                                // Convert the link URL to a direct download link (change the link from dl=0 to dl=1 for instant download)
                                let sharedUrl = linkResponse.result.url;
                                sharedUrl = sharedUrl.slice(0, -1) + "1";
                        
                                try {
                                    // Add font to db
                                    const font = await new Font({
                                        creator: userID,
                                        name: fontName,
                                        dropboxDownloadLink: sharedUrl,
                                        dropboxFilePath: uploadResponse.result.path_display
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

                            })
                            .catch(error => {
                                console.error('Error creating shared link:', error);
                            });
                    })
                    .catch(error => {
                        console.error('Error uploading file:', error);
                    });

            // Handle tracked exit errors from Python process defined in ERROR_DICT and return corresponding message
            } else if (exitCode in ERROR_DICT) {
                console.log(errorMessage);
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


export const deleteFont = async (req, res) => {  
    try {
        const { fontID } = req.body;

        // check if our db has a font with the ID of the fontID
        const font = await Font.findOne({
            "_id": fontID
        });
        if (!font) {
            return res.json({
                error: "No font found with fontID",
            });
        }

        // delete the font from the backend
        try {
            // delete from dropbox first
            try {
                const dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });
                await dbx.filesDeleteV2({ path: font.dropboxFilePath });
            } catch (err) {
                console.error('Error deleting file:', err);
                return res.status(350).send("Error deleting font from dropbox. Try again.");
            }

            // delete from MongoDB
            const resp = await Font.deleteOne(
                {'_id': fontID}
            );

            return res.json({
                ok: true
            });
        } catch (err) {
            console.log(err);
            return res.status(300).send("Error deleting font from db. Try again.");
        }

    } catch (err) {
        console.log(err);
        return res.status(400).send("Error. Try again.");
    }
};
