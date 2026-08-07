import { body, param, validationResult } from "express-validator";
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};
export const productIdParam = [
  param("productId").isMongoId().withMessage("Invalid product id"),
];
export const addVariantValidation = [
  param("productId").isMongoId().withMessage("Invalid product id"),
  body("sku").notEmpty().withMessage("Variant sku is required").trim(),
  body("price")
    .notEmpty()
    .withMessage("Variant price is required")
    .isNumeric()
    .withMessage("Variant price must be a number")
    .custom((value) => value >= 0)
    .withMessage("Variant price must not be negative"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Variant stock must be a non-negative integer"),
  body("isDefault")
    .optional()
    .isBoolean()
    .withMessage("isDefault must be a boolean"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
  body("images").optional().isArray().withMessage("Images must be an array"),
  body("attributes")
    .optional()
    .isArray()
    .withMessage("Attributes must be an array"),
  body("attributes.*.attribute")
    .optional()
    .isMongoId()
    .withMessage("Invalid attribute id"),
  body("attributes.*.value")
    .optional()
    .isMongoId()
    .withMessage("Invalid attribute value id"),
];
export const updateVariantValidation = [
  param("productId").isMongoId().withMessage("Invalid product id"),
  param("id").isMongoId().withMessage("Invalid variant id"),
  body("sku").optional().trim(),
  body("price")
    .optional()
    .isNumeric()
    .withMessage("Variant price must be a number")
    .custom((value) => value >= 0)
    .withMessage("Variant price must not be negative"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Variant stock must be a non-negative integer"),
  body("isDefault")
    .optional()
    .isBoolean()
    .withMessage("isDefault must be a boolean"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
  body("images").optional().isArray().withMessage("Images must be an array"),
  body("attributes")
    .optional()
    .isArray()
    .withMessage("Attributes must be an array"),
  body("attributes.*.attribute")
    .optional()
    .isMongoId()
    .withMessage("Invalid attribute id"),
  body("attributes.*.value")
    .optional()
    .isMongoId()
    .withMessage("Invalid attribute value id"),
];
export const deleteVariantValidation = [
  param("productId").isMongoId().withMessage("Invalid product id"),
  param("id").isMongoId().withMessage("Invalid variant id"),
];
