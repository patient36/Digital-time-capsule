import User from "../../models/user.model.js";
import generateToken from "../../utils/generateToken.js";


const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name?.trim() || !email?.trim() || !password?.trim()) {
            return res.status(400).json({ message: "Name, email, and password are all required." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        const user = await User.create({ name: name.trim(), email: email.trim(), password });
        if (user) {
            generateToken(res, user._id);
            return res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email
            });
        } else {
            return res.status(500).json({ message: "Failed to create user." });
        }

    } catch (error) {
        next(error);
    }
};


const authUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email?.trim() || !password?.trim()) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const user = await User.findOne({ email }).select("+password");

        if (user && (await user.matchPasswords(password))) {
            generateToken(res, user._id);
            return res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                message: "Logged in successfully."
            });
        } else {
            return res.status(401).json({ message: "Invalid email or password." });
        }

    } catch (error) {
        next(error);
    }
};


const logoutUser = async (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(200).json({ message: "No active session to log out from." });
    }

    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });

    res.status(200).json({ message: "Logged out successfully." });
};


const resetPassword = async (req, res, next) => {
    try {
        const { email, oldPassword, newPassword } = req.body;
        if (!email?.trim() || !oldPassword?.trim() || !newPassword?.trim()) {
            return res.status(400).json({ message: "Email, old password, and new password are required." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const match = await user.matchPasswords(oldPassword);
        if (!match) {
            return res.status(401).json({ message: "Old password is incorrect." });
        }

        user.password = newPassword;
        await user.save();

        return res.status(200).json({ message: "Password reset successfully." });
    } catch (error) {
        next(error);
    }
}

const authControllers = { registerUser, authUser, logoutUser, resetPassword }

export default authControllers