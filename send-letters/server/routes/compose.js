import express from "express";

const router = express.Router();

// controllers 
const { compose } = require("../controllers/compose");

router.get("/", (req, res) => {
    return res.json({
        data: "hello world from the API",
    });
});

router.post("/compose", compose);

export default router; 