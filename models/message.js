import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    attachments: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Attachment",
    },
    deliveryDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "delivered"],
        default: "pending",
    }
}, { timestamps: true }

);

export const Message = mongoose.model("Message", messageSchema);