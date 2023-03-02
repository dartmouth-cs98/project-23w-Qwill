import express from "express";

const router = express.Router();

// controllers 
const { receiveLetters, updateLetterStatus } = require("../controllers/mailbox");

router.get("/", (req, res) => {
    return res.json({
        data: "hello world from the API",
    });
});

router.post("/receiveLetters", receiveLetters);
router.post("/updateLetterStatus", updateLetterStatus);

export default router; 