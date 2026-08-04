import { Router } from "express";
import upload from "../services/multer.js"
import authMiddleware from "../middleware/auth.middleware.js"
import authorize from "../middleware/roles.middleware.js";
import { addCategory, getCategory, updateCategory, deleteCategory } from "../controllers/category.controller.js";
import { addCategoryValidation, updateCategoryValidation, validate } from "../validators/category.validator.js"
const categoryRouter = Router()

categoryRouter.post("/", authMiddleware, authorize("admin"), upload.single("image"), addCategoryValidation, validate, addCategory)
categoryRouter.get("/", getCategory)
categoryRouter.put("/:id", authMiddleware, authorize("admin"), upload.single("image"), updateCategoryValidation, validate, updateCategory)
categoryRouter.delete("/:id", authMiddleware, authorize("admin"), deleteCategory)

export default categoryRouter