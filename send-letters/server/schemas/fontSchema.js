import mongoose from "mongoose";

const fontSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    firebaseDownloadLink: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    firebaseFilePath: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    resetCode: "",
}, {
    timestamps: true
});

export default mongoose.model("Font", fontSchema);