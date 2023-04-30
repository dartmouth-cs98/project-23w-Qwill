import express from "express";

const router = express.Router();

// get controllers 
const {
    createCustomFont,
} = require("../controllers/fontControllers");

router.get("/", (req, res) => {
    return res.json({
        data: "hello world from the API",
    });
});

// post routes
router.post("/createCustomFont", createCustomFont);

export default router; 
