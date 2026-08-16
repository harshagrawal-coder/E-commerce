import { Router } from "express";
const vendorProductRouter = Router();
import authMiddleware from "../middleware/auth.middleware.js";
import authorize, {
  requireApprovedVendor,
} from "../middleware/roles.middleware.js";
import {
  addProductValidation,
  updateProductValidation,
  deleteProductValidation,
  validate,
} from "../validators/product.validator.js";
import upload from "../services/multer.js";
import {
  createProductByVendor,
  getProductByVendor,
  updateProductByVendor,
  deleteProductByVendor,
} from "../controllers/product.controller.js";
vendorProductRouter.get(
  "/",
  authMiddleware,
  authorize("vendor"),
  requireApprovedVendor,
  getProductByVendor,
);
vendorProductRouter.post(
  "/",
  authMiddleware,
  authorize("vendor"),
  requireApprovedVendor,
  upload.array("images"),
  addProductValidation,
  validate,
  createProductByVendor,
);
vendorProductRouter.put(
  "/:id",
  authMiddleware,
  authorize("vendor"),
  requireApprovedVendor,
  upload.array("images"),
  updateProductValidation,
  validate,
  updateProductByVendor,
);
vendorProductRouter.delete(
  "/:id",
  authMiddleware,
  authorize("vendor"),
  requireApprovedVendor,
  deleteProductValidation,
  validate,
  deleteProductByVendor,
);
export default vendorProductRouter;
