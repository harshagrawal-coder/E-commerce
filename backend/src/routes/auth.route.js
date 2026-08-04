import { Router } from "express"
import { registerUser, loginUser, getMeUser } from "../controllers/auth.controller.js"
import { registerValidation, loginValidation, validate } from "../validators/auth.validator.js"
import authMiddleware from "../middleware/auth.middleware.js"

const authRouter = Router()
authRouter.post("/register", registerValidation, validate, registerUser)
authRouter.post("/login", loginValidation, validate, loginUser)
authRouter.get("/get-me", authMiddleware, getMeUser)
export default authRouter
