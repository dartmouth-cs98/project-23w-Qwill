import express from "express";

const router = express.Router();

// controllers 
const { receiveLetters, getDrafts, updateLetterStatus, updateLetterInfo } = require("../controllers/mailbox");

router.get("/", (req, res) => {
    return res.json({
        data: "hello world from the API",
    });
});

router.post("/receiveLetters", receiveLetters);
router.post("/getDrafts", getDrafts);
router.post("/updateLetterStatus", updateLetterStatus);
router.post("/updateLetterInfo", updateLetterInfo);

export default router; 