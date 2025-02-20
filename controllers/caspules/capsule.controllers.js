import { nanoid } from "nanoid";
import Capsule from "../../models/capsule.model.js";
import User from "../../models/user.model.js";
import { encrypt, decrypt } from "../../utils/encrpyt.js";

const createCapsule = async (req, res, next) => {
    try {
        const userId = req.user._id
        const { message, deliveryDate } = req.body
        if (!message || !deliveryDate) {
            return res.status(400).json({ message: "Some crucial data about the capsule are missing" })
        }
        if (new Date(deliveryDate) <= Date.now()) {
            return res.status(403).json({ message: "Set a future date for delivery" })
        }
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User does not exist" })
        }
        const key = nanoid(10)
        // encrypt message and attachment chunks until delivery date 
        const encrypted = encrypt(message, key)
        const capsule = await Capsule.create({
            message: encrypted, deliveryDate, userId, key
        })

        res.status(201).json({ capsule, message: "Capsule created successfully" })
    } catch (error) {
        next(error)
    }
}

const getPendingCapsules = async (req, res, next) => {
    try {
        const userId = req.user._id
        if (!userId) {
            return res.status(401).json({ message: "Invalid token" })
        }
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User does not exist" })
        }
        // pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;
        const totalCaps = await Capsule.countDocuments({ userId, status: "pending" })
        const totalPages = Math.ceil(totalCaps / limit)

        if (page > totalPages) {
            let pending = []
            return res.status(200).json({
                meta: {
                    user: user.name,
                    totalPages,
                    pageSize: pending.length,
                    page,
                    message: "page not found"
                },
                data: {
                    pending
                }
            })
        }

        // fetch data
        const pending = await Capsule.find({ userId, status: "pending" }).select("_id attachments deliveryDate status createdAt").skip(skip).limit(limit)

        res.status(200).json({
            meta: {
                user: user.name,
                page,
                totalPages,
                pageSize: pending.length
            },
            data: {
                pending
            }
        })
    } catch (error) {
        next(error)
    }
}


const getDeliveredCapsules = async (req, res, next) => {
    try {
        const userId = req.user._id
        if (!userId) {
            return res.status(401).json({ message: "Invalid token" })
        }
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User does not exist" })
        }
        // pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;
        const totalCaps = await Capsule.countDocuments({ userId, status: "delivered" })
        const totalPages = Math.ceil(totalCaps / limit)
        if (page > totalPages) {
            let delivered = []
            return res.status(200).json({
                meta: {
                    user: user.name,
                    totalPages,
                    pageSize: delivered.length,
                    page,
                    message: "page not found"
                },
                data: {
                    delivered
                }
            })
        }
        // fetch data
        const delivered = await Capsule.find({ userId, status: "delivered" }).select("_id attachments deliveryDate status createdAt").skip(skip).limit(limit)

        res.status(200).json({
            meta: {
                user: user.name,
                page,
                totalPages,
                pageSize: delivered.length
            },
            data: {
                delivered
            }
        })
    } catch (error) {
        next(error)
    }
}

const getCapsule = async (req, res, next) => {
    try {
        const capId = req.params.id
        const userId = req.user._id

        if (!userId) {
            return res.status(401).json({ message: "Invalid token" })
        }

        const capsule = await Capsule.findOne({ _id: capId, userId })
        if (!capsule) {
            return res.status(404).json({ message: "Capsule not found" })
        }

        if (capsule.deliveryDate > new Date()) {
            const response = {
                _id: capsule._id,
                message: "Unavailable",
                attachments: capsule.attachments,
                deliveryDate: capsule.deliveryDate,
                status: capsule.status,
                createdAt: capsule.createdAt
            }
            return res.status(200).json({ response })
        }

        const response = {
            _id: capsule._id,
            message: decrypt(capsule.message, capsule.key),
            attachments: capsule.attachments,
            deliveryDate: capsule.deliveryDate,
            status: capsule.status,
            createdAt: capsule.createdAt
        }


        res.status(200).json({ message: "Successful fetch", response })
    } catch (error) {
        next(error)
    }
}

const deleteCapsule = async (req, res, next) => {
    try {
        const capsuleId = req.params.id
        const capsule = await Capsule.findById(capsuleId)
        if (!capsule) {
            return res.status(404).json("Failed to delete a non-existing capsule")
        }

        // delete all attachments
        // delete the capsule
        res.status(200).json({ message: `${capsule.status} capsule  deleted` })
    } catch (error) {
        next(error)
    }
}
const capsuleControllers = { createCapsule, getCapsule, deleteCapsule, getPendingCapsules, getDeliveredCapsules }

export default capsuleControllers