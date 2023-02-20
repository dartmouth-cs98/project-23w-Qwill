import mongoose from "mongoose";

// const { Schema } = mongoose;

const letterSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,
        required: true,
    },
    resetCode: "",
}, {
    timestamps: true
});

export default mongoose.model("Letter", letterSchema);