import User from "../schemas/userSchema";
import Font from "../schemas/fontSchema";


export const createCustomFont = async (req, res) => {
    // Initialize an error dictionary that maps potential python exit codes with their corresponding error messages to sent to user
    const ERROR_DICT = {
        50: "Unable to connect to Google Cloud Vision. Servers may be down.",
        51: "Unable to detect handwriting in text. Make sure photo quality is high and to follow the instructions carefully.",
        52: "Unable to cut image into individual .png images.",
        53: "Unable to convert .png images of each character into the .svg format.",
        54: "Unable to convert .svg files into a .ttf font file",
        55: "Error sending generated font file back to server"
    }

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

        // Convert the base64 image to a PNG file and store in the temp folder
        // const imageBuffer = Buffer.from(handwritingImage, 'base64');
        // const imagePath = `temp/${user.username}.png`;
        // fs.writeFileSync(imagePath, imageBuffer);

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
                const buffer = Buffer.from(output, 'base64')
                const fontName = user.username + "-font-" + (user.numCustomFonts+1).toString();

                // // write the buffer to a file
                // const imagePath = `${user.username}.ttf`;
                // fs.writeFile(imagePath, buffer, (err) => {
                //     if (err) throw err;
                //     console.log('The file has been saved!');
                // });

                try {
                    // Add font to db
                    const letter = await new Font({
                        creator: userID,
                        name: fontName,
                        fileContent: buffer,
                    }).save();

                    // Update number of custom fonts for the user
                    await User.updateOne(
                        { 'username': user.username}, 
                        { 'numCustomFonts': user.numCustomFonts+1 }
                    );
                    
                    return res.json({
                        message: "Congrats, your font has been made!"
                    });

                } catch (err) {
                    console.log(err);
                }

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
            console.log(doc)
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