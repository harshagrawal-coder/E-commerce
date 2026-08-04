import { body, validationResult } from "express-validator"
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    next();
}
export const registerValidation = [
    body("name")
        .notEmpty().withMessage("Name is required")
        .trim()
        .isLength({ min: 3 }).withMessage("Name must be at least 3 characters"),
    body("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format"),
body("password")
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&#]{6,}$/)
        .withMessage("Password must include uppercase, lowercase, number and special character"),
    body("role")
        .optional()
        .isIn(["user", "vendor", "admin"]).withMessage("Role must be user, vendor or admin")
]

export const loginValidation = [
    body("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format"),
    body("password")
        .notEmpty().withMessage("Password is required")
]

