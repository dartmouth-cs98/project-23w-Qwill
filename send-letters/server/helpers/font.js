import User from "../schemas/userSchema";
import Font from "../schemas/fontSchema";
require("dotenv").config();

/**
 * POST /api/deleteFontBackend
 * Deletes a font from the Mongo database and Firebase storage based on the request body
 *
 * Request body: { fontID: String }
 * Response: { ok: Boolean } || { error: String }
 */
 export const deleteFontBackend = async (fontID) => {  
    try {
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
            var fileRef = storage.bucket().file(font.firebaseFilePath);

            // Delete the file from Firebase Storage
            fileRef.delete().then(async function() {
                // delete from MongoDB
                const resp = await Font.deleteOne(
                    {'_id': fontID}
                );

                return "Font deleted successfully";

            }).catch(function(error) {
                console.log("Error deleting file:", error);
            });

        } catch (err) {
            console.log(err);
            return "Error deleting font from db. Try again.";
        }

    } catch (err) {
        console.log(err);
        return "Error. Try again.";
    }
};