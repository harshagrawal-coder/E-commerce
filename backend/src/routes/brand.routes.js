import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import authorize from "../middleware/roles.middleware.js";
import {
  addBrand,
  getBrand,
  updateBrand,
  deleteBrand,
} from "../controllers/brand.controller.js";
import {
  addBrandValidation,
  updateBrandValidation,
  validate,
} from "../validators/brand.validator.js";
const brandRouter = Router();

brandRouter.post(
  "/",
  authMiddleware,
  authorize("admin"),
  addBrandValidation,
  validate,
  addBrand,
);
brandRouter.get("/", getBrand);
brandRouter.put(
  "/:id",
  authMiddleware,
  authorize("admin"),
  updateBrandValidation,
  validate,
  updateBrand,
);
brandRouter.delete("/:id", authMiddleware, authorize("admin"), deleteBrand);

export default brandRouter;
