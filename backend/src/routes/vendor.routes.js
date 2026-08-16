import Router from "express";
import {
  createVendor,
  getVendor,
  updateVendor,
} from "../controllers/vendorController.js";
import authMiddleware from "../middleware/auth.middleware.js";
import authorize from "../middleware/roles.middleware.js";
import upload from "../services/multer.js";
import {
  createVendorValidation,
  validate,
  updateVendorValidation,
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
vendorRouter.get("/profile", authMiddleware, authorize("vendor"), getVendor);
vendorRouter.put(
  "/:id",
  authMiddleware,
  authorize("vendor"),
  upload.single("image"),
  updateVendorValidation,
  validate,
  updateVendor,
);

export default vendorRouter;
