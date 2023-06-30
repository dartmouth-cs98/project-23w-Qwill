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
        type: String,
        required: true
    },
    firebaseFilePath: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        required: true,
    },
    resetCode: "",
}, {
    timestamps: true
});

export default mongoose.model("Font", fontSchema);