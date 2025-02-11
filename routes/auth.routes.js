import express from "express"
import authControllers from "../controllers/auth/user.auth.js"
import { protect } from "../middlewares/auth.js"

const authRouter = express.Router()

authRouter.post('/register', authControllers.registerUser)
authRouter.post('/login', authControllers.authUser)
authRouter.post('/logout', authControllers.logoutUser)
authRouter.patch('/reset-password', protect, authControllers.resetPassword)

export default authRouter