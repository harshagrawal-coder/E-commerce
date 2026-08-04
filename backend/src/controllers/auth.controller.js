import User from "../models/user.model.js"
import jwt from "jsonwebtoken"
import { config } from "../config/config.js"
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }
        const user = await User.create({ name, email, password, role })
        const token = jwt.sign({
            email: user.email,
            id: user._id,
            name: user.name,
            role: user.role
        }, config.JWT_SECRET)
        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        })
    } catch (error) {
        console.error(error);
        console.error(error.stack);
        return res.status(500).json({
            message: error.message
        });
    }
}
export const loginUser = async (req, res) => {
    const { email, password } = req.body
    const isEmailExist = await User.findOne({ email })
    if (!isEmailExist) {
        return res.status(404).json({
            success: false,
            message: "email is not register"
        })
    }
    const isPasswordValid = await isEmailExist.isPasswordCorrect(password);
    if (!isPasswordValid) {
        return res.status(401).json({
            success: false,
            message: "Invalid password"
        });
    }
    const token = jwt.sign(
        {
            id: isEmailExist._id,
            email: isEmailExist.email,
            role: isEmailExist.role
        },
        config.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );
    return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
            id: isEmailExist._id,
            name: isEmailExist.name,
            email: isEmailExist.email,
            role: isEmailExist.role
        }
    });
}
export const getMeUser = async (req, res) => {
    const user = req.user
    return res.status(200).json({
        success: true,
        message: "user data fetched successfully",
        user: user
    })
}

