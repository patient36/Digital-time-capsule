import express from 'express'
import getFile from '../utils/getFile.js'
import { protect } from '../middlewares/auth.js'
import { Attachment, AttachmentChunk } from '../models/attachment.model.js'


const streamRouter = express.Router()

streamRouter.get("/:id", async (req, res, next) => {
    try {
        const userId = req.query.user
        const fileId = req.params.id
        await getFile(fileId, Attachment, AttachmentChunk, res, req, next)
    } catch (error) {
        next(error)
    }
})

export default streamRouter