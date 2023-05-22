import express from "express";

const router = express.Router();

// get controllers 
const {
    createCustomFont,
    fetchCustomFonts,
    deleteFont,
    updateFontName,
} = require("../controllers/fontControllers");

router.get("/", (req, res) => {
    return res.json({
        data: "hello world from the API",
    });
});

// post routes
router.post("/createCustomFont", createCustomFont);
router.post("/fetchCustomFonts", fetchCustomFonts);
router.post("/deleteFont", deleteFont);
router.post("/updateFontName", updateFontName);


export default router; 
