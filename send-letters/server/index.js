require("dotenv" ).config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import letterRoutes from "./routes/letterRoutes";

// const port = process.env.PORT || 8000;
const port = 8000;

const morgan = require("morgan");

const app = express();

mongoose
    .connect(process.env.DATABASE)
    .then(() => console.log("DB connected"))
    .catch((err) => console.log("DB CONNECTION ERROR: ", err));

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

// route middlewares
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", letterRoutes);

app.listen(port, () => console.log("Server running on port " + port));
