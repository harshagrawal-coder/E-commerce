import { body, param, validationResult } from "express-validator"
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    next();
}
export const addAttributeValidation = [
    body("name")
        .notEmpty().withMessage("Attribute name is required")
        .trim()
        .isLength({ min: 2 }).withMessage("Attribute name must be at least 2 characters")
        .isLength({ max: 50 }).withMessage("Attribute name must not exceed 50 characters"),
    body("inputType")
        .optional()
        .isIn(["select", "multiselect", "text", "number", "boolean"]).withMessage("Invalid input type"),
    body("isVariant")
        .optional()
        .isBoolean().withMessage("isVariant must be a boolean"),
    body("isFilterable")
        .optional()
        .isBoolean().withMessage("isFilterable must be a boolean"),
    body("isRequired")
        .optional()
        .isBoolean().withMessage("isRequired must be a boolean"),
    body("isActive")
        .optional()
        .isBoolean().withMessage("isActive must be a boolean"),
    body("displayOrder")
        .optional()
        .isInt().withMessage("displayOrder must be an integer")
]
export const updateAttributeValidation = [
    param("id")
        .isMongoId().withMessage("Invalid attribute id"),
    body("name")
        .optional()
        .trim()
        .isLength({ min: 2 }).withMessage("Attribute name must be at least 2 characters")
        .isLength({ max: 50 }).withMessage("Attribute name must not exceed 50 characters"),
    body("inputType")
        .optional()
        .isIn(["select", "multiselect", "text", "number", "boolean"]).withMessage("Invalid input type"),
    body("isVariant")
        .optional()
        .isBoolean().withMessage("isVariant must be a boolean"),
    body("isFilterable")
        .optional()
        .isBoolean().withMessage("isFilterable must be a boolean"),
    body("isRequired")
        .optional()
        .isBoolean().withMessage("isRequired must be a boolean"),
    body("isActive")
        .optional()
        .isBoolean().withMessage("isActive must be a boolean"),
    body("displayOrder")
        .optional()
        .isInt().withMessage("displayOrder must be an integer")
]