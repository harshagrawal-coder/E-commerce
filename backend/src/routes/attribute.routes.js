import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import authorize from "../middleware/roles.middleware.js";
import {
  addAttribute,
  getAttribute,
  updateAttribute,
  deleteAttribute,
} from "../controllers/attribute.controller.js";
import {
  addAttributeValidation,
  updateAttributeValidation,
  validate,
} from "../validators/attribute.validator.js";
const attributeRouter = Router();

attributeRouter.post(
  "/",
  authMiddleware,
  authorize("admin"),
  addAttributeValidation,
  validate,
  addAttribute,
);
attributeRouter.get("/", getAttribute);
attributeRouter.put(
  "/:id",
  authMiddleware,
  authorize("admin"),
  updateAttributeValidation,
  validate,
  updateAttribute,
);
attributeRouter.delete(
  "/:id",
  authMiddleware,
  authorize("admin"),
  deleteAttribute,
);

export default attributeRouter;
