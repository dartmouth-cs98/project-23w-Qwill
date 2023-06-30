import express from "express";

const router = express.Router();

// get controllers 
const { 
    matchUsers, 
    sendFriendRequest, 
    acceptFriendRequest, 
    deleteFriendRequest, 
    getIncomingFriendReqs,
    countUserStats
} = require("../controllers/userControllers");

router.get("/", (req, res) => {
    return res.json({
        data: "hello world from the API",
    });
});

// post routes
router.post("/matchUsers", matchUsers);
router.post("/sendFriendRequest", sendFriendRequest);
router.post("/acceptFriendRequest", acceptFriendRequest);
router.post("/deleteFriendRequest", deleteFriendRequest);
router.post("/getIncomingFriendReqs", getIncomingFriendReqs);
router.post("/countUserStats", countUserStats);

export default router; 