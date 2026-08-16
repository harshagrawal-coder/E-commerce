import Router from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import authorize from "../middleware/roles.middleware.js";
import {
  getAllVendors,
  getVendorDetail,
  updateVendorStatus,
} from "../controllers/vendorController.js";
import { updateVendorStatusValidation, validate } from "../validators/vendor.validator.js";
const adminRouter = Router();
adminRouter.get("/vendors", authMiddleware, authorize("admin"), getAllVendors);
adminRouter.get(
  "/vendors/:id",
  authMiddleware,
  authorize("admin"),
  getVendorDetail,
);
adminRouter.patch(
  "/vendors/:id/status",
  authMiddleware,
  authorize("admin"),
  updateVendorStatusValidation,
  validate,
  updateVendorStatus,
);
export default adminRouter;
