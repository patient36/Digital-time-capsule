import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";


const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body
        if (!name | !email | !password) {
            res.status(400).json({ message: "name, email, password are all required" })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            res.status(400).json({ message: "User already exists" })
        }

        const user = await User.create({ name, email, password })
        if (user) {
            generateToken(res, user._id)
            res.status(201).json({ _id: user._id, name: user.name, email: user.email })
        }
        else {
            res.status(400).json({ message: "Failed to create user" })
        }

    } catch (error) {
        next(error)
    }
}

const authUser = async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email | !password) {
            res.status(400).json({ message: "email and  password are all required" })
        }

        const user = await User.findOne({ email })
        if (user && (await user.matchPasswords(password))) {
            generateToken(res, user._id)
            res.status(200).json({ _id: user._id, name: user.name, email: user.email, message: "Logged in successfully" })
        }
        else {
            res.status(401).json({ message: "Invalid credentials" })
        }

    } catch (error) {
        next(error)
    }
}

const logoutUser = async (req, res, next) => {
    res.cookie("jwt", "", {
        htttpOnly: true,
        expires: new Date(0)
    })
    res.json({ message: "Logged out successfully" })
}

const userControllers = { registerUser, authUser, logoutUser }

export default userControllers