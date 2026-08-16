import { Router } from "express";
import upload from "../services/multer.js"
import authMiddleware from "../middleware/auth.middleware.js"
import authorize from "../middleware/roles.middleware.js";
import { addProduct, getAllProducts, updateProduct, deleteProduct, updateProductStatus } from "../controllers/product.controller.js";
import { addProductValidation, updateProductValidation, updateProductStatusValidation, validate } from "../validators/product.validator.js"
const productRouter = Router()

productRouter.post("/", authMiddleware, authorize("admin"), upload.array("images"), addProductValidation, validate, addProduct)
productRouter.get("/", getAllProducts)
productRouter.put("/:id", authMiddleware, authorize("admin"), upload.array("images"), updateProductValidation, validate, updateProduct)
productRouter.patch("/:id/status", authMiddleware, authorize("admin"), updateProductStatusValidation, validate, updateProductStatus)
productRouter.delete("/:id", authMiddleware, authorize("admin"), deleteProduct)

export default productRouter