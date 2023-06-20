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
    phone: {
        type: Number,
        required: false,
        min: 10,
        max: 12,
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 64,
    },
    numCustomFonts: {
        type: Number,
        required: true,
        min: 0,
    },
    resetCode: "",
}, {
    timestamps: true
});

export default mongoose.model("User", userSchema);
