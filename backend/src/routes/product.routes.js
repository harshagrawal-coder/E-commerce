import { Router } from "express";
import upload from "../services/multer.js"
import authMiddleware from "../middleware/auth.middleware.js"
import authorize from "../middleware/roles.middleware.js";
import { addProduct, getProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js";
import { addProductValidation, updateProductValidation, validate } from "../validators/product.validator.js"
const productRouter = Router()

productRouter.post("/", authMiddleware, authorize("admin"), upload.array("images"), addProductValidation, validate, addProduct)
productRouter.get("/", getProduct)
productRouter.put("/:id", authMiddleware, authorize("admin"), upload.array("images"), updateProductValidation, validate, updateProduct)
productRouter.delete("/:id", authMiddleware, authorize("admin"), deleteProduct)

export default productRouter