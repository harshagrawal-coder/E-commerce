import { Router } from "express";
import upload from "../services/multer.js"
import authMiddleware from "../middleware/auth.middleware.js"
import authorize from "../middleware/roles.middleware.js";
import { addSubCategory, getSubCategory, updateSubCategory, deleteSubCategory } from "../controllers/subCategory.controller.js";
import { addSubCategoryValidation, updateSubCategoryValidation, validate } from "../validators/subCategory.validator.js"
const subCategoryRouter = Router()

subCategoryRouter.post("/", authMiddleware, authorize("admin"), upload.single("image"), addSubCategoryValidation, validate, addSubCategory)
subCategoryRouter.get("/", getSubCategory)
subCategoryRouter.put("/:id", authMiddleware, authorize("admin"), upload.single("image"), updateSubCategoryValidation, validate, updateSubCategory)
subCategoryRouter.delete("/:id", authMiddleware, authorize("admin"), deleteSubCategory)

export default subCategoryRouter
