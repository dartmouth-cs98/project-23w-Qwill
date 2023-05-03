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
    fileContent: {
        // buffer type in Mongoose automatically maps file to "BSON Binary" type stored in MongoDB
        type: mongoose.Schema.Types.Buffer,
        required: true
    },
    resetCode: "",
}, {
    timestamps: true
});

export default mongoose.model("Font", fontSchema);