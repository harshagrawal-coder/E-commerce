import { body, param, validationResult } from "express-validator"
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    next();
}
export const addBrandValidation = [
    body("name")
        .notEmpty().withMessage("Brand name is required")
        .trim()
        .isLength({ min: 2 }).withMessage("Brand name must be at least 2 characters")
        .isLength({ max: 50 }).withMessage("Brand name must not exceed 50 characters"),
    body("description")
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage("Description must not exceed 500 characters")
]
export const updateBrandValidation = [
    param("id")
        .isMongoId().withMessage("Invalid brand id"),
    body("name")
        .optional()
        .trim()
        .isLength({ min: 2 }).withMessage("Brand name must be at least 2 characters")
        .isLength({ max: 50 }).withMessage("Brand name must not exceed 50 characters"),
    body("description")
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage("Description must not exceed 500 characters")
]
