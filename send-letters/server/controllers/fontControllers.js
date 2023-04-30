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
        const imageBuffer = Buffer.from(handwritingImage, 'base64');
        const imagePath = `temp/${user.username}.png`;
        fs.writeFileSync(imagePath, imageBuffer);

        // Create a new Python process to generate the ttf file
        const spawn = require ("child_process").spawn;
        const pythonProcess = spawn('python', ["../server/handwriting/scripts/main.py", imagePath]);
        
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
            // Check the exit code to see if the process completed successfully
            if (code === 0) {
                // If the process completed successfully, send the TTF file back to the client
                // res.setHeader('Content-Type', 'application/octet-stream');
                // res.setHeader('Content-Disposition', 'attachment; filename=font.ttf');
                // res.send(ttfFile);

                // TODO: add to MongoDB
                console.log(output);
                return res.json({
                    ok: true
                });

            } else {
                // If the Python returned an error, send the error message back to the client
                console.log(`Child process exited with code ${code}`);
                res.status(500).send(errorMessage || 'An error occurred while processing the image.');
            }
        });

        // Handle errors from spawning the Python process
        pythonProcess.on('error', (err) => {
            console.error(err);
            res.status(500).send('An error occurred while processing the image.');
        });

        // Remove the image file
        fs.unlinkSync(imagePath);

    } catch (err) {
        console.log(err);
        return res.status(400).send("Error. Try again.");
    }
};