import express from "express"

const app = express()



app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`))