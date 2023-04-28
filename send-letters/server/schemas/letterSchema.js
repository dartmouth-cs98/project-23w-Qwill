import mongoose from "mongoose";
mongoose.Schema.Types.String.checkRequired(v => typeof v === 'string');

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
    status: {  // draft, sent, read, archive
        type: String,
        required: true,
    },
    theme: {
        type: String,
        required: false,
    },
    font: {
        type: String,
        required: false,
    },
    stickers: {
        type: Array,
        required: true
    },
    resetCode: "",
}, {
    timestamps: true
});

export default mongoose.model("Letter", letterSchema);