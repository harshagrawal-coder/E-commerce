import { body, param, validationResult } from "express-validator"
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    next();
}
export const addAttributeValueValidation = [
    body("attribute")
        .notEmpty().withMessage("Attribute id is required")
        .isMongoId().withMessage("Invalid attribute id"),
    body("value")
        .notEmpty().withMessage("Value is required")
        .trim()
        .isLength({ min: 1 }).withMessage("Value must be at least 1 character")
        .isLength({ max: 100 }).withMessage("Value must not exceed 100 characters"),
    body("displayOrder")
        .optional()
        .isInt().withMessage("displayOrder must be an integer"),
    body("isDefault")
        .optional()
        .isBoolean().withMessage("isDefault must be a boolean"),
    body("isActive")
        .optional()
        .isBoolean().withMessage("isActive must be a boolean")
]
export const updateAttributeValueValidation = [
    param("id")
        .isMongoId().withMessage("Invalid attribute value id"),
    body("attribute")
        .optional()
        .isMongoId().withMessage("Invalid attribute id"),
    body("value")
        .optional()
        .trim()
        .isLength({ min: 1 }).withMessage("Value must be at least 1 character")
        .isLength({ max: 100 }).withMessage("Value must not exceed 100 characters"),
    body("displayOrder")
        .optional()
        .isInt().withMessage("displayOrder must be an integer"),
    body("isDefault")
        .optional()
        .isBoolean().withMessage("isDefault must be a boolean"),
    body("isActive")
        .optional()
        .isBoolean().withMessage("isActive must be a boolean")
]