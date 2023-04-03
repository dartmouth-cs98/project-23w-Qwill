require("dotenv" ).config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth";
import composeRoutes from "./routes/compose";
import mailboxRoutes from "./routes/mailbox";

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
app.use("/api", composeRoutes);
app.use("/api", mailboxRoutes);

app.listen(port, () => console.log("Server running on port " + port));
