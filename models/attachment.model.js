import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    length: { type: Number, required: true },
    chunkSize: { type: Number, required: true },
}, { timestamps: true })

const attachmentChunksSchema = mongoose.Schema({
    files_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Attachment"
    },
    n: { type: Number, required: true },
    data: { type: Buffer, required: true },
}, { timestamps: true })

const Attachment = mongoose.model("Attachment", attachmentSchema);
const AttachmentChunk = mongoose.model("AttachmentChunk", attachmentChunksSchema)

export { Attachment, AttachmentChunk }