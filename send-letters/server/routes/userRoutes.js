import express from "express";

const router = express.Router();

// get controllers 
const { matchUsers, sendFriendRequest } = require("../controllers/userControllers");

router.get("/", (req, res) => {
    return res.json({
        data: "hello world from the API",
    });
});

// post routes
router.post("/matchUsers", matchUsers);
router.post("/sendFriendRequest", sendFriendRequest);

export default router; 