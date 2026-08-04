import { body, param, validationResult } from "express-validator"
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    next();
}
export const addCategoryValidation = [
    body("name")
        .notEmpty().withMessage("Category name is required")
        .trim()
        .isLength({ min: 3 }).withMessage("Category name must be at least 3 characters")
        .isLength({ max: 50 }).withMessage("Category name must not exceed 50 characters"),
    body("description")
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage("Description must not exceed 500 characters")
]
export const updateCategoryValidation = [
    param("id")
        .isMongoId().withMessage("Invalid category id"),
    body("name")
        .optional()
        .trim()
        .isLength({ min: 3 }).withMessage("Category name must be at least 3 characters")
        .isLength({ max: 50 }).withMessage("Category name must not exceed 50 characters"),
    body("description")
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage("Description must not exceed 500 characters")
]
