import express from "express";

const router = express.Router();

// get controllers 
const { matchUsers, 
    sendFriendRequest, 
    acceptFriendRequest, 
    declineFriendRequest, 
    getIncomingFriendReqs 
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
router.post("/declineFriendRequest", declineFriendRequest);
router.post("/getIncomingFriendReqs", getIncomingFriendReqs);

export default router; 