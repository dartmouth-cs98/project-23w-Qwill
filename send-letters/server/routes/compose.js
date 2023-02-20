import express from "express";

const router = express.Router();

// controllers 
const { sendLetter, matchRecipient } = require("../controllers/compose");

router.get("/", (req, res) => {
    return res.json({
        data: "hello world from the API",
    });
});

router.post("/sendLetter", sendLetter);
router.post("/matchRecipient", matchRecipient);


export default router; 