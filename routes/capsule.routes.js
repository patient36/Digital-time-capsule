import express from "express";
import capsuleControllers from "../controllers/caspules/capsule.controllers.js";

const capsuleRouter = express.Router()

capsuleRouter.post('/create', capsuleControllers.createCapsule)

capsuleRouter.get('/', capsuleControllers.getAllCapsules)

capsuleRouter.get('/:id', capsuleControllers.getCapsule)

capsuleRouter.delete('/delete/:id', capsuleControllers.deleteCapsule)


export default capsuleRouter