import { body, param, validationResult } from "express-validator"
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    next();
}
export const addProductValidation = [
    body("name")
        .notEmpty().withMessage("Product name is required")
        .trim()
        .isLength({ min: 2 }).withMessage("Product name must be at least 2 characters")
        .isLength({ max: 100 }).withMessage("Product name must not exceed 100 characters"),
    body("description")
        .notEmpty().withMessage("Description is required")
        .trim(),
    body("category")
        .notEmpty().withMessage("Category is required")
        .isMongoId().withMessage("Invalid category id"),
    body("subCategory")
        .notEmpty().withMessage("Sub-category is required")
        .isMongoId().withMessage("Invalid sub-category id"),
    body("brand")
        .notEmpty().withMessage("Brand is required")
        .isMongoId().withMessage("Invalid brand id"),
    body("vendor")
        .optional()
        .isMongoId().withMessage("Invalid vendor id"),
    body("isActive")
        .optional()
        .isBoolean().withMessage("isActive must be a boolean"),
    body("isFeatured")
        .optional()
        .isBoolean().withMessage("isFeatured must be a boolean"),
    body("images")
        .optional()
        .isArray().withMessage("Images must be an array"),
    body("images.*.url")
        .optional()
        .isString().withMessage("Image url must be a string"),
    body("images.*.alt")
        .optional()
        .isString().withMessage("Image alt must be a string"),
    body("images.*.fileId")
        .optional()
        .isString().withMessage("Image fileId must be a string"),
    body("variants")
        .optional()
        .isArray().withMessage("Variants must be an array"),
    body("variants.*.sku")
        .if(body("variants").exists())
        .notEmpty().withMessage("Variant sku is required")
        .trim(),
    body("variants.*.price")
        .if(body("variants").exists())
        .isNumeric().withMessage("Variant price must be a number")
        .custom((value) => value >= 0).withMessage("Variant price must not be negative"),
    body("variants.*.stock")
        .optional()
        .isInt({ min: 0 }).withMessage("Variant stock must be a non-negative integer"),
    body("variants.*.isDefault")
        .optional()
        .isBoolean().withMessage("isDefault must be a boolean"),
    body("variants.*.isActive")
        .optional()
        .isBoolean().withMessage("isActive must be a boolean"),
    body("variants.*.attributes")
        .optional()
        .isArray().withMessage("Variant attributes must be an array"),
    body("variants.*.attributes.*.attribute")
        .optional()
        .isMongoId().withMessage("Invalid attribute id"),
    body("variants.*.attributes.*.value")
        .optional()
        .isMongoId().withMessage("Invalid attribute value id"),
]
export const updateProductValidation = [
    param("id")
        .isMongoId().withMessage("Invalid product id"),
    body("name")
        .optional()
        .trim()
        .isLength({ min: 2 }).withMessage("Product name must be at least 2 characters")
        .isLength({ max: 100 }).withMessage("Product name must not exceed 100 characters"),
    body("description")
        .optional()
        .trim(),
    body("category")
        .optional()
        .isMongoId().withMessage("Invalid category id"),
    body("subCategory")
        .optional()
        .isMongoId().withMessage("Invalid sub-category id"),
    body("brand")
        .optional()
        .isMongoId().withMessage("Invalid brand id"),
    body("vendor")
        .optional()
        .isMongoId().withMessage("Invalid vendor id"),
    body("isActive")
        .optional()
        .isBoolean().withMessage("isActive must be a boolean"),
    body("isFeatured")
        .optional()
        .isBoolean().withMessage("isFeatured must be a boolean"),
    body("images")
        .optional()
        .isArray().withMessage("Images must be an array"),
    body("variants")
        .optional()
        .isArray().withMessage("Variants must be an array"),
    body("variants.*.sku")
        .if(body("variants").exists())
        .notEmpty().withMessage("Variant sku is required")
        .trim(),
    body("variants.*.price")
        .if(body("variants").exists())
        .isNumeric().withMessage("Variant price must be a number")
        .custom((value) => value >= 0).withMessage("Variant price must not be negative"),
    body("variants.*.stock")
        .optional()
        .isInt({ min: 0 }).withMessage("Variant stock must be a non-negative integer"),
    body("variants.*.attributes")
        .optional()
        .isArray().withMessage("Variant attributes must be an array"),
    body("variants.*.attributes.*.attribute")
        .optional()
        .isMongoId().withMessage("Invalid attribute id"),
    body("variants.*.attributes.*.value")
        .optional()
        .isMongoId().withMessage("Invalid attribute value id"),
]
