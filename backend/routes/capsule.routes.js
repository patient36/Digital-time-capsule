import express from "express";
import capsuleControllers from "../controllers/caspules/capsule.controllers.js";
import { protect } from "../middlewares/auth.js";
import upload from "../config/storage.js";

const capsuleRouter = express.Router()

capsuleRouter.post('/create', protect, upload.fields([{ name: "attachment", maxCount: 5 }]), capsuleControllers.createCapsule)

capsuleRouter.get('/pending', protect, capsuleControllers.getPendingCapsules)

capsuleRouter.get('/delivered', protect, capsuleControllers.getDeliveredCapsules)

capsuleRouter.get('/:id', protect, capsuleControllers.getCapsule)

capsuleRouter.delete('/:id', protect, capsuleControllers.deleteCapsule)


export default capsuleRouter