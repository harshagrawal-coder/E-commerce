import Router from "express";
import { createVendor, getVendor } from "../controllers/vendorController.js";
import authMiddleware from "../middleware/auth.middleware.js";
import authorize from "../middleware/roles.middleware.js";
import upload from "../services/multer.js";
import {
  createVendorValidation,
  updateVendorStatusValidation,
  validate,
  updateVendorStatusValidation,
} from "../validators/vendor.validator.js";
const vendorRouter = Router();
vendorRouter.post(
  "/",
  authMiddleware,
  authorize("vendor"),
  upload.single("image"),
  createVendorValidation,
  validate,
  createVendor,
);
vendorRouter.get("/", authMiddleware, authorize("vendor"), getVendor);
