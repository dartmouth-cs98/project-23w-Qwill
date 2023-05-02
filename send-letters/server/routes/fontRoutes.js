import express from "express";

const router = express.Router();

// get controllers 
const {
    createCustomFont,
    fetchCustomFonts,
} = require("../controllers/fontControllers");

router.get("/", (req, res) => {
    return res.json({
        data: "hello world from the API",
    });
});

// post routes
router.post("/createCustomFont", createCustomFont);
router.post("/fetchCustomFonts", fetchCustomFonts);

export default router; 
