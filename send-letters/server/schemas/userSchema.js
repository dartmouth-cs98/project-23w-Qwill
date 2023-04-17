import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        index: true,
    },
    username: {
        type: String,
        trim: true,
        required: true,
        index: true,
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 64,
    },
    resetCode: "",
}, {
    timestamps: true
});

export default mongoose.model("User", userSchema);
