import express from "express";

const router = express.Router();

// controllers 
const { makeLetter, matchRecipient } = require("../controllers/compose");

router.get("/", (req, res) => {
    return res.json({
        data: "hello world from the API",
    });
});

router.post("/makeLetter", makeLetter);
router.post("/matchRecipient", matchRecipient);

export default router; 