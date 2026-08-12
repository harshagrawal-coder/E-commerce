import { body, param, validationResult } from "express-validator";
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};
export const createVendorValidation = [
  body("businessName")
    .notEmpty()
    .withMessage("Business name is required")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Business name must be at least 2 characters")
    .isLength({ max: 100 })
    .withMessage("Business name must not exceed 100 characters"),
  body("businessType")
    .notEmpty()
    .withMessage("Business type is required")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Business type must be at least 2 characters")
    .isLength({ max: 50 })
    .withMessage("Business type must not exceed 50 characters"),
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must not exceed 500 characters"),
  body("address")
    .notEmpty()
    .withMessage("Address is required")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Address must be at least 5 characters")
    .isLength({ max: 200 })
    .withMessage("Address must not exceed 200 characters"),
  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Phone number must be at least 10 digits")
    .isLength({ max: 15 })
    .withMessage("Phone number must not exceed 15 characters")
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage("Phone number contains invalid characters"),
];
export const updateVendorStatusValidation = [
  param("id").isMongoId().withMessage("Invalid vendor id"),
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["pending", "approved", "rejected", "suspended"])
    .withMessage("Invalid vendor status"),
];
export const updateVendorValidation = [
  param("id").isMongoId().withMessage("Invalid vendor id"),
  body("businessName")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Business name must be at least 2 characters")
    .isLength({ max: 100 })
    .withMessage("Business name must not exceed 100 characters"),
  body("businessType")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Business type must be at least 2 characters")
    .isLength({ max: 50 })
    .withMessage("Business type must not exceed 50 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must not exceed 500 characters"),
  body("address")
    .optional()
    .trim()
    .isLength({ min: 5 })
    .withMessage("Address must be at least 5 characters")
    .isLength({ max: 200 })
    .withMessage("Address must not exceed 200 characters"),
  body("phone")
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage("Phone number must be at least 10 digits")
    .isLength({ max: 15 })
    .withMessage("Phone number must not exceed 15 characters")
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage("Phone number contains invalid characters"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];
