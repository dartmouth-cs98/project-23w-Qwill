import mongoose from "mongoose";

// const { Schema } = mongoose;

const letterSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // recipient: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // },
    recipient: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true,
    },
    resetCode: "",
}, {
    timestamps: true
});

export default mongoose.model("Letter", letterSchema);