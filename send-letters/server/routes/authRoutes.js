import express from "express";

const router = express.Router();

// get controllers 
const { 
    signUp, 
    signIn, 
    forgotPassword, 
    resetPassword,
    changeName,
    changeUsername, 
    changePassword,
    reportBug
} = require("../controllers/authControllers");

router.get("/", (req, res) => {
    return res.json({
        data: "hello world from the API",
    });
});

// post routes
router.post("/signUp", signUp);
router.post("/signIn", signIn);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);
router.post("/changeName", changeName);
router.post("/changeUsername", changeUsername);
router.post("/changePassword", changePassword);
router.post("/reportBug", reportBug);

export default router; 
