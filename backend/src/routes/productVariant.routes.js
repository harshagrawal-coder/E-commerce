import { Router } from "express";

import upload from "../services/multer.js";
import authMiddleware from "../middleware/auth.middleware.js";
import authorize from "../middleware/roles.middleware.js";

import {
  // Admin
  addVariant,
  getVariants,
  updateVariant,
  deleteVariant,
  getPendingVariants,
  updateStatusVariant,

  // Vendor
  addVariantByVendor,
  getVariantsByVendor,
  updateVariantByVendor,
  deleteVariantByVendor,
} from "../controllers/productVariant.controller.js";

import {
  productIdParam,
  addVariantValidation,
  updateVariantValidation,
  deleteVariantValidation,
  // updateVariantStatusValidation,
  validate,
  parseVariantFields,
} from "../validators/productVariant.validator.js";

const productVariantRouter = Router();

/*
=========================================================
                    ADMIN VARIANT ROUTES
=========================================================
*/

// Admin creates a variant
productVariantRouter.post(
  "/admin/product/:productId",
  authMiddleware,
  authorize("admin"),
  upload.array("images"),
  parseVariantFields,
  addVariantValidation,
  validate,
  addVariant,
);

// Admin gets ALL variants of a product
productVariantRouter.get(
  "/admin/product/:productId",
  authMiddleware,
  authorize("admin"),
  productIdParam,
  validate,
  getVariants,
);

// Admin gets PENDING variants of a specific product
productVariantRouter.get(
  "/admin/product/:productId/pending",
  authMiddleware,
  authorize("admin"),
  productIdParam,
  validate,
  getPendingVariants,
);

// Admin gets ALL pending variants across all products
productVariantRouter.get(
  "/admin/pending",
  authMiddleware,
  authorize("admin"),
  getPendingVariants,
);

// Admin updates any variant
productVariantRouter.put(
  "/admin/product/:productId/:id",
  authMiddleware,
  authorize("admin"),
  upload.array("images"),
  parseVariantFields,
  updateVariantValidation,
  validate,
  updateVariant,
);

// Admin deletes any variant
productVariantRouter.delete(
  "/admin/product/:productId/:id",
  authMiddleware,
  authorize("admin"),
  deleteVariantValidation,
  validate,
  deleteVariant,
);

// Admin approves / rejects / changes status
productVariantRouter.patch(
  "/admin/:id/status",
  authMiddleware,
  authorize("admin"),
  // updateVariantStatusValidation,
  validate,
  updateStatusVariant,
);

/*
=========================================================
                    VENDOR VARIANT ROUTES
=========================================================
*/

// Vendor creates a variant
productVariantRouter.post(
  "/vendor/product/:productId",
  authMiddleware,
  authorize("vendor"),
  upload.array("images"),
  parseVariantFields,
  addVariantValidation,
  validate,
  addVariantByVendor,
);

// Vendor gets variants of their own product
productVariantRouter.get(
  "/vendor/product/:productId",
  authMiddleware,
  authorize("vendor"),
  productIdParam,
  validate,
  getVariantsByVendor,
);

// Vendor updates their own variant
productVariantRouter.put(
  "/vendor/product/:productId/:id",
  authMiddleware,
  authorize("vendor"),
  upload.array("images"),
  parseVariantFields,
  updateVariantValidation,
  validate,
  updateVariantByVendor,
);

// Vendor deletes their own variant
productVariantRouter.delete(
  "/vendor/product/:productId/:id",
  authMiddleware,
  authorize("vendor"),
  deleteVariantValidation,
  validate,
  deleteVariantByVendor,
);

export default productVariantRouter;
