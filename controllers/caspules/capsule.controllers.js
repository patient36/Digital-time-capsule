import { nanoid } from "nanoid";
import Capsule from "../../models/capsule.model.js";
import User from "../../models/user.model.js";

const createCapsule = async (req, res, next) => {
    try {
        const { message, deliveryDate, userId } = req.body
        // encrypt message and attachment chunks until delivery date 
        if (!message || !deliveryDate || !userId) {
            return res.status(400).json({ message: "Some crucial data about the capsule is missing" })
        }
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not does not exist" })
        }
        const key = nanoid(10)
        const capsule = await Capsule.create({
            message, deliveryDate, userId, key
        })

        res.status(201).json({ capsule, message: "Capsule created successfully" })
    } catch (error) {
        next(error)
    }
}

const getAllCapsules = async (req, res, next) => {
    try {
        const { userId } = req.body
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User doesn't exist" }).select("-key")
        }
        // get pending capsules
        const pending = await Capsule.find({ userId, status: "pending" }).select("-key-attachments ")

        // get delivered capsules
        const delivered = await Capsule.find({ userId, status: "delivered" })
        res.status(200).json({ user: user.name, pending, delivered })
    } catch (error) {
        next(error)
    }
}

const getCapsule = async (req, res, next) => {
    try {
        const capId = req.params.id
        const capsule = await Capsule.findById(capId)
        if (!capsule) {
            return res.status(404).json({ message: "Capsule not found" })
        }
        // verify deliveryDate
        // decrypt message
        const response = { message: capsule.message, attachments: capsule.attachments, createdAt: capsule.createdAt, deliveryDate: capsule.deliveryDate }
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
const capsuleControllers = { createCapsule, getCapsule, deleteCapsule, getAllCapsules }

export default capsuleControllers