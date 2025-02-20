import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDB from "./config/db.js"
import { notFound, errorHandler } from "./middlewares/error.js"
import authRouter from "./routes/auth.routes.js"
import capsuleRouter from "./routes/capsule.routes.js"
import streamRouter from "./routes/stream.attachment.js"

dotenv.config()
connectDB()

const PORT = process.env.PORT | 5000
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: process.env.CLIENT }))
app.use(cookieParser())
app.use('/api/user/auth', authRouter)
app.use('/api/capsule', capsuleRouter)
app.use('/api/get-file', streamRouter)
app.use(notFound)
app.use(errorHandler)


app.listen(PORT, () => console.log(`Server running on port ${PORT}`))