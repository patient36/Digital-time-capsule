import express from 'express'
import getFile from '../utils/getFile.js'
import { protect } from '../middlewares/auth.js'
import { Attachment, AttachmentChunk } from '../models/attachment.model.js'
import Capsule from '../models/capsule.model.js'

const streamRouter = express.Router()

streamRouter.get("/:id", async (req, res, next) => {
    try {
        const capId = req.query.capsule
        const userId = req.query.user
        const fileId = req.params.id
        const capsule = await Capsule.findOne({ _id: capId, userId, attachments: { $in: [fileId] } })

        if (!capsule) {
            return res.status(404).json({ message: "Capsule not found" });
        }
        const now = new Date()
        if (capsule.deliveryDate <= now) {
            await getFile(fileId, Attachment, AttachmentChunk, userId, res, req, next)
        }
        else {
            return res.status(200).json({ message: "Access denied before delivery date.", deliveryDate: capsule.deliveryDate})
        }
    } catch (error) {
        next(error)
    }
})

export default streamRouter