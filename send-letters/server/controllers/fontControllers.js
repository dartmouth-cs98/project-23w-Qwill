import User from "../schemas/userSchema";
import Font from "../schemas/fontSchema";
import fs from 'fs';

const ERROR_DICT = {
    50: "Unable to connect to Google Cloud Vision. Servers may be down.",
    51: "Unable to detect handwriting in text. Make sure photo quality is high and to follow the instructions carefully.",
    52: "Unable to cut image into individual .png images.",
    53: "Unable to convert .png images of each character into the .svg format.",
    54: "Unable to convert .svg files into a .ttf font file",
    55: "Error sending generated font file back to server"
}

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
            console.log(output);
            // Check the exit code to see if the process completed successfully
            if (exitCode === 0) {
                
                // If the process completed successfully, send the TTF file back to the client
                // res.setHeader('Content-Type', 'application/octet-stream');
                // res.setHeader('Content-Disposition', 'attachment; filename=font.ttf');
                // res.send(ttfFile);

                // TODO: add to MongoDB
                console.log(output);
                // const imagePath = `${user.username}.ttf`;
                // fs.writeFileSync(imagePath, output);
                // console.log("wrote ttf file to: " + imagePath);

                // console.log(res.headersSent);

                // Update number of custom fonts for the user
                await User.updateOne(
                    { 'username': user.username}, 
                    { 'numCustomFonts': user.numCustomFonts+1 }
                );
                
                return res.json({
                    message: "Congrats, your font has been made!"
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
