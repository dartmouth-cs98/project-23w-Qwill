import express from "express";

const router = express.Router();

// get controllers 
const { makeLetter, fetchLetters, updateLetterStatus, updateLetterInfo } = require("../controllers/letterControllers");

router.get("/", (req, res) => {
    return res.json({
        data: "hello world from the API",
    });
});

// post routes
router.post("/makeLetter", makeLetter);
router.post("/fetchLetters", fetchLetters);
router.post("/updateLetterStatus", updateLetterStatus);
router.post("/updateLetterInfo", updateLetterInfo);

export default router; 