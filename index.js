import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import router from "./routes/message.js"
import cors from "cors"

dotenv.config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: process.env.CLIENT }))
app.use('/api', router)

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Could not connect to MongoDB", err))

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`))