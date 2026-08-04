import { body, param, validationResult } from "express-validator"
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    next();
}
export const addSubCategoryValidation = [
    body("name")
        .notEmpty().withMessage("Sub-category name is required")
        .trim()
        .isLength({ min: 3 }).withMessage("Sub-category name must be at least 3 characters")
        .isLength({ max: 50 }).withMessage("Sub-category name must not exceed 50 characters"),
    body("category")
        .notEmpty().withMessage("Category is required")
        .isMongoId().withMessage("Invalid category id"),
    body("description")
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage("Description must not exceed 500 characters")
]
export const updateSubCategoryValidation = [
    param("id")
        .isMongoId().withMessage("Invalid sub-category id"),
    body("name")
        .optional()
        .trim()
        .isLength({ min: 3 }).withMessage("Sub-category name must be at least 3 characters")
        .isLength({ max: 50 }).withMessage("Sub-category name must not exceed 50 characters"),
    body("category")
        .optional()
        .isMongoId().withMessage("Invalid category id"),
    body("description")
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage("Description must not exceed 500 characters")
]
