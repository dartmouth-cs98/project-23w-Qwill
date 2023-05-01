import User from "../schemas/userSchema";
import Font from "../schemas/fontSchema";
import fs from 'fs';


export const createCustomFont = async (req, res) => {
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
        const pythonProcess = spawn('python3', ["../server/handwriting/scripts/main.py"], {
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
        pythonProcess.on('close', (code) => {
            console.log(output);
            // Check the exit code to see if the process completed successfully
            if (code === 0) {
                
                // If the process completed successfully, send the TTF file back to the client
                // res.setHeader('Content-Type', 'application/octet-stream');
                // res.setHeader('Content-Disposition', 'attachment; filename=font.ttf');
                // res.send(ttfFile);

                // TODO: add to MongoDB
                console.log(output);
                // console.log(res.headersSent);
                
                
                return res.json({
                    message: "Congrats, your font has been made!"
                });

            // Handle Python exit due to error running Google Cloud Vision text detection 
            } else if (code == 50) {
                return res.json({
                    message: "Unable to connect to Google Cloud Vision. Servers may be down."
                });
            
            // Handle Python exit due to Google Cloud Vision text detection unable to detect any text
            } else if (code == 51) {
                return res.json({
                    message: "Unable to detect handwriting in text. Make sure photo quality is high and to follow the instructions carefully."
                });
            
            // Handle Python exit due to issue cutting image into individual png files
            } else if (code == 52) {
                return res.json({
                    message: "Unable to cut image into individual .png images."
                });

            // Handle Python exit due to issue converting png files to svg format
            } else if (code == 53) {
                return res.json({
                    message: "Unable to convert .png images of each character into the .svg format."
                });
            
            // Handle untracked errors caused during the Python execution
            } else {
                console.error(`Child process exited with code ${code}`);
                console.log(errorMessage);
                return res.status(500).send(errorMessage || 'An error occurred while processing the image.');
            }
        });

        // Handle errors from spawning the Python process
        pythonProcess.on('error', (err) => {
            console.error(err);
            return res.status(500).send('An error occurred while processing the image.');
        });

        // Remove the image file
        // fs.unlinkSync(imagePath);

    } catch (err) {
        console.error(err);
        return res.status(400).send("Error. Try again.");
    }
};


// make a function to delete all files from temp (takes in the directory)
