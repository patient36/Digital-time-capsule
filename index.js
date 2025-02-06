import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js"
import { notFound, errorHandler } from "./middlewares/error.js"

dotenv.config()
connectDB()

const PORT = process.env.PORT | 5000
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: process.env.CLIENT }))
app.use(notFound)
app.use(errorHandler)


app.listen(PORT, () => console.log(`Server running on port ${PORT}`))