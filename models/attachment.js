import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema({})


export const Attachment = mongoose.model("Attachment", attachmentSchema);