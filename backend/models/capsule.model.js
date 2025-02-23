import mongoose from "mongoose";

const capsuleSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    key: {
        type: String,
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

const Capsule = mongoose.model("Capsule", capsuleSchema);

export default Capsule