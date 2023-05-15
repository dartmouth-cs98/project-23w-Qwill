import express from "express";
const router = express.Router();


const uptimePing = async (req, res) => {
    console.log("Pinging server to stay awake...");
    return res.status(0).send("Server has been pinged successfully");
};


router.get("/", (req, res) => {
    return res.json({
        data: "hello world from the API",
    });
});

// post routes
router.post("/uptimePing", uptimePing);


export default router; 
