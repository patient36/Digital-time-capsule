import express from "express"
import userControllers from "../controllers/user.controllers.js"
import { protect } from "../middlewares/auth.js"

const userRouter = express.Router()

userRouter.post('/auth/register', userControllers.registerUser)
userRouter.post('/auth/login', userControllers.authUser)
userRouter.post('/logout', userControllers.logoutUser)

export default userRouter