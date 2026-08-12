import { Router } from "express";
import upload from "../services/multer.js";
import authMiddleware from "../middleware/auth.middleware.js";
import authorize from "../middleware/roles.middleware.js";
import {
  addVariant,
  getVariants,
  updateVariant,
  deleteVariant,
} from "../controllers/productVariant.controller.js";
import {
  productIdParam,
  addVariantValidation,
  updateVariantValidation,
  deleteVariantValidation,
  validate,
  parseVariantFields,
} from "../validators/productVariant.validator.js";
const productVariantRouter = Router();
productVariantRouter.post(
  "/product/:productId",
  authMiddleware,
  authorize("admin"),
  upload.array("images"),
  parseVariantFields,
  addVariantValidation,
  validate,
  addVariant,
);
productVariantRouter.get(
  "/product/:productId",
  productIdParam,
  validate,
  getVariants,
);
productVariantRouter.put(
  "/product/:productId/:id",
  authMiddleware,
  authorize("admin"),
  upload.array("images"),
  updateVariantValidation,
  validate,
  updateVariant,
);
productVariantRouter.delete(
  "/product/:productId/:id",
  authMiddleware,
  authorize("admin"),
  deleteVariantValidation,
  validate,
  deleteVariant,
);
export default productVariantRouter;
