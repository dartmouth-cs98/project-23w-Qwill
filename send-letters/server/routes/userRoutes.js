import express from "express";

const router = express.Router();

// get controllers 
const { matchRecipient } = require("../controllers/userControllers");

router.get("/", (req, res) => {
    return res.json({
        data: "hello world from the API",
    });
});

// post routes
router.post("/matchRecipient", matchRecipient);

export default router; 