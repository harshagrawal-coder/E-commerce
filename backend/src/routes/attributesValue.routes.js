import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js"
import authorize from "../middleware/roles.middleware.js";
import { addAttributeValue, getAttributeValue, updateAttributeValue, deleteAttributeValue } from "../controllers/attributesValue.controller.js";
import { addAttributeValueValidation, updateAttributeValueValidation, validate } from "../validators/attributesValue.validator.js"
const attributeValueRouter = Router()

attributeValueRouter.post("/", authMiddleware, authorize("admin"), addAttributeValueValidation, validate, addAttributeValue)
attributeValueRouter.get("/", getAttributeValue)
attributeValueRouter.put("/:id", authMiddleware, authorize("admin"), updateAttributeValueValidation, validate, updateAttributeValue)
attributeValueRouter.delete("/:id", authMiddleware, authorize("admin"), deleteAttributeValue)

export default attributeValueRouter