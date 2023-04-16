import express from "express";

const router = express.Router();

// get controllers 
const { matchUser } = require("../controllers/userControllers");

router.get("/", (req, res) => {
    return res.json({
        data: "hello world from the API",
    });
});

// post routes
router.post("/matchUser", matchUser);

export default router; 