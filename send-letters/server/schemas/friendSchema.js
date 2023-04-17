import mongoose from "mongoose";
mongoose.Schema.Types.String.checkRequired(v => typeof v === 'string');

const friendSchema = new mongoose.Schema({
    friendReqSender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    friendReqRecipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {  // pending, friends
        type: String,
        required: true,
    },
    resetCode: "",
}, {
    timestamps: true
});

export default mongoose.model("Friend", friendSchema);