import ProductVariant from "../models/poductVariant.schema.js";
import Product from "../models/product.models.js";
import Vendor from "../models/vendor.model.js";
import Attribute from "../models/attrubutes.model.js";
import AttributeValue from "../models/attributesValue.model.js";
import { uploadFile, deleteFile } from "../services/imagekit.js";
import {
  ValidationError,
  validateVariantAgainstSubCategory,
} from "../services/variantValidation.js";

const validateVariant = async (variant, skus) => {
  if (!variant.sku) {
    throw new Error("Variant sku is required");
  }
  if (skus.includes(variant.sku)) {
    throw new Error(`Duplicate variant sku: ${variant.sku}`);
  }
  skus.push(variant.sku);

  if (variant.price === undefined || variant.price < 0) {
    throw new Error(`Invalid price for variant ${variant.sku}`);
  }

  if (variant.attributes && variant.attributes.length) {
    const seen = new Set();
    for (const attr of variant.attributes) {
      if (!attr.attribute || !attr.value) {
        throw new Error(
          `Attribute and value are required for variant ${variant.sku}`,
        );
      }
      if (seen.has(attr.attribute.toString())) {
        throw new Error(`Duplicate attribute in variant ${variant.sku}`);
      }
      seen.add(attr.attribute.toString());

      const attribute = await Attribute.findById(attr.attribute);
      if (!attribute) {
        throw new Error(`Attribute ${attr.attribute} not found`);
      }

      const attributeValue = await AttributeValue.findOne({
        _id: attr.value,
        attribute: attr.attribute,
      });
      if (!attributeValue) {
        throw new Error(`Invalid value for attribute ${attr.attribute}`);
      }
    }
  }
};
const parseArrayField = (value) => {
  if (value === undefined || value === null) return [];
  if (Array.isArray(value)) return value;
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
};
export const addVariant = async (req, res) => {
  const uploadedFileIds = [];

  try {
    const { productId } = req.params;

    const { sku, price, stock, images, isDefault, isActive } = req.body;

    // attributes can come as JSON string because request is multipart/form-data
    const attributes = parseArrayField(req.body.attributes);

    // --------------------------------------------------
    // 1. Check product
    // --------------------------------------------------

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // --------------------------------------------------
    // 2. Product must already be approved
    // --------------------------------------------------

    if (product.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Cannot create variant for a product that is not approved",
      });
    }

    // --------------------------------------------------
    // 3. Check SKU uniqueness
    // --------------------------------------------------

    const existingVariant = await ProductVariant.findOne({ sku });

    if (existingVariant) {
      return res.status(409).json({
        success: false,
        message: "Variant SKU already exists",
      });
    }

    // --------------------------------------------------
    // 4. Validate variant
    // --------------------------------------------------

    await validateVariant(
      {
        sku,
        price,
        attributes,
      },
      [],
    );

    // --------------------------------------------------
    // 5. Validate attributes against sub-category
    // --------------------------------------------------

    await validateVariantAgainstSubCategory({
      subCategoryId: product.subCategory,
      attributes,
      sku,
    });

    // --------------------------------------------------
    // 6. Upload images
    // --------------------------------------------------

    const variantImages = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadedImage = await uploadFile({
          file: file.buffer,
          fileName: file.originalname,
          folder: "/product-variants",
        });

        uploadedFileIds.push(uploadedImage.file.fileId);

        variantImages.push({
          url: uploadedImage.file.url,
          alt: sku,
          fileId: uploadedImage.file.fileId,
        });
      }
    }

    // --------------------------------------------------
    // 7. Optional: support images sent in body
    // --------------------------------------------------

    if (images) {
      const bodyImages =
        typeof images === "string" ? JSON.parse(images) : images;

      if (Array.isArray(bodyImages)) {
        variantImages.push(...bodyImages);
      }
    }

    // --------------------------------------------------
    // 8. Create variant
    // --------------------------------------------------

    const variant = await ProductVariant.create({
      product: productId,
      sku,
      attributes,
      price,
      stock,
      images: variantImages,
      isDefault,
      isActive,

      // Admin-created variant is automatically approved
      status: "approved",
    });

    // --------------------------------------------------
    // 9. Success response
    // --------------------------------------------------

    return res.status(201).json({
      success: true,
      message: "Product variant created successfully",
      data: variant,
    });
  } catch (error) {
    // --------------------------------------------------
    // 10. Delete uploaded images if something fails
    // --------------------------------------------------

    for (const fileId of uploadedFileIds) {
      try {
        await deleteFile(fileId);
      } catch (deleteError) {
        console.error("Failed to delete uploaded file:", deleteError.message);
      }
    }

    // --------------------------------------------------
    // 11. Custom validation error
    // --------------------------------------------------

    if (error instanceof ValidationError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    // --------------------------------------------------
    // 12. General error
    // --------------------------------------------------

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getVariants = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    const variants = await ProductVariant.find({ product: productId })
      .populate("attributes.attribute", "name slug")
      .populate("attributes.value", "value slug");
    return res.status(200).json({
      success: true,
      message: "Product variants fetched successfully",
      data: variants,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getPendingVariants = async (req, res) => {
  try {
    const variants = await ProductVariant.find({
      status: "pending",
    })
      .populate("attributes.attribute", "name slug")
      .populate("attributes.value", "value slug")
      .populate({
        path: "product",
        select: "name slug vendor",
        populate: {
          path: "vendor",
          select: "businessName user",
          populate: {
            path: "user",
            select: "name email",
          },
        },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Pending variants fetched successfully",
      data: variants,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateVariant = async (req, res) => {
  const uploadedFileIds = [];
  try {
    const { productId, id } = req.params;
    const { sku, price, stock, images, isDefault, isActive } = req.body;
    const attributes = parseArrayField(req.body.attributes);

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const variant = await ProductVariant.findOne({
      _id: id,
      product: productId,
    });
    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Product variant not found",
      });
    }
    if (sku) {
      const existingVariant = await ProductVariant.findOne({ sku });
      if (
        existingVariant &&
        existingVariant._id.toString() !== variant._id.toString()
      ) {
        return res.status(409).json({
          success: false,
          message: "Variant sku already exists",
        });
      }
      variant.sku = sku;
    }

    if (price !== undefined) {
      variant.price = price;
    }

    if (stock !== undefined) {
      variant.stock = stock;
    }

    if (attributes.length) {
      await validateVariant(
        { sku: variant.sku, price: variant.price, attributes },
        [],
      );
      await validateVariantAgainstSubCategory({
        subCategoryId: product.subCategory,
        attributes,
        sku: variant.sku,
      });
      variant.attributes = attributes;
    }

    if (isDefault !== undefined) {
      variant.isDefault = isDefault;
    }

    if (isActive !== undefined) {
      variant.isActive = isActive;
    }

    if (images !== undefined) {
      variant.images = images;
    }

    if (req.files && req.files.length) {
      const oldImages = variant.images || [];

      const variantImages = [];
      for (const file of req.files) {
        const uploadedImage = await uploadFile({
          file: file.buffer,
          fileName: file.originalname,
          folder: "/product-variants",
        });
        uploadedFileIds.push(uploadedImage.file.fileId);
        variantImages.push({
          url: uploadedImage.file.url,
          alt: variant.sku,
          fileId: uploadedImage.file.fileId,
        });
      }
      // Merge previously stored images (kept during edit) in their current order
      const existingImages =
        typeof req.body.existingImages === "string"
          ? JSON.parse(req.body.existingImages)
          : req.body.existingImages;
      if (Array.isArray(existingImages)) {
        variantImages.push(...existingImages);
      }
      variant.images = variantImages;

      for (const image of oldImages) {
        if (image.fileId) {
          await deleteFile(image.fileId);
        }
      }
    }

    await variant.save();

    return res.status(200).json({
      success: true,
      message: "Product variant updated successfully",
      data: variant,
    });
  } catch (error) {
    for (const fileId of uploadedFileIds) {
      await deleteFile(fileId);
    }

    if (error instanceof ValidationError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const deleteVariant = async (req, res) => {
  try {
    const { productId, id } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const variant = await ProductVariant.findOne({
      _id: id,
      product: productId,
    });
    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Product variant not found",
      });
    }

    if (variant.images && variant.images.length) {
      for (const image of variant.images) {
        if (image.fileId) {
          await deleteFile(image.fileId);
        }
      }
    }

    await ProductVariant.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Product variant deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateStatusVariant = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowedStatus = ["pending", "approved", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(404).json({
        success: false,
        message: "variant not found",
      });
    }
    const variant = await ProductVariant.findById(id);
    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found",
      });
    }
    variant.status = status;
    await variant.save();
    return res.status(200).json({
      success: true,
      message: `Variant ${status} successfully`,
      data: variant,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addVariantByVendor = async (req, res) => {
  const uploadedFileIds = [];
  try {
    const { productId } = req.params;
    const { sku, price, stock, images, isDefault, isActive } = req.body;
    const vendor = await Vendor.findOne({
      user: req.user._id,
    });
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }
    const product = await Product.findOne({
      _id: productId,
      vendor: vendor._id,
    });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or does not belong to this vendor",
      });
    }
    // ----------------------------------------
    // 3. Product must be approved
    // ----------------------------------------
    if (product.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Cannot create variant for a product that is not approved",
      });
    }
    // ----------------------------------------
    // 4. Parse attributes
    // ----------------------------------------
    const attributes = parseArrayField(req.body.attributes);
    // ----------------------------------------
    // 5. Check duplicate SKU
    // ----------------------------------------
    const existingVariant = await ProductVariant.findOne({
      sku,
    });
    if (existingVariant) {
      return res.status(409).json({
        success: false,
        message: "Variant SKU already exists",
      });
    }
    // ----------------------------------------
    // 6. Validate variant
    // ----------------------------------------
    await validateVariant(
      {
        sku,
        price,
        attributes,
      },
      [],
    );
    // ----------------------------------------
    // 7. Validate attributes against
    //    product sub-category
    // ----------------------------------------
    await validateVariantAgainstSubCategory({
      subCategoryId: product.subCategory,
      attributes,
      sku,
    });
    // ----------------------------------------
    // 8. Upload images
    // ----------------------------------------
    const variantImages = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadedImage = await uploadFile({
          file: file.buffer,
          fileName: file.originalname,
          folder: "/product-variants",
        });
        uploadedFileIds.push(uploadedImage.file.fileId);
        variantImages.push({
          url: uploadedImage.file.url,
          alt: sku,
          fileId: uploadedImage.file.fileId,
        });
      }
    }
    // ----------------------------------------
    // 9. Optional body images
    // ----------------------------------------
    if (images) {
      const bodyImages =
        typeof images === "string" ? JSON.parse(images) : images;
      if (Array.isArray(bodyImages)) {
        variantImages.push(...bodyImages);
      }
    }
    // ----------------------------------------
    // 10. Create variant
    // ----------------------------------------
    const variant = await ProductVariant.create({
      product: productId,
      sku,
      attributes,
      price,
      stock,
      images: variantImages,
      isDefault,
      isActive,
      // IMPORTANT:
      // Vendor variants always require admin approval
      status: "pending",
    });
    // ----------------------------------------
    // 11. Response
    // ----------------------------------------
    return res.status(201).json({
      success: true,
      message:
        "Product variant created successfully and is waiting for admin approval",
      data: variant,
    });
  } catch (error) {
    // ----------------------------------------
    // Delete uploaded files if something fails
    // ----------------------------------------
    for (const fileId of uploadedFileIds) {
      await deleteFile(fileId);
    }
    if (error instanceof ValidationError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getVariantsByVendor = async (req, res) => {
  try {
    const { productId } = req.params;
    // 1. Find logged-in vendor
    const vendor = await Vendor.findOne({
      user: req.user._id,
    });
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }
    // 2. Make sure this product belongs to this vendor
    const product = await Product.findOne({
      _id: productId,
      vendor: vendor._id,
    });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    // 3. Get variants of that product
    const variants = await ProductVariant.find({
      product: product._id,
    })
      .populate("attributes.attribute", "name slug")
      .populate("attributes.value", "value slug")
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "All variants related to the product fetched successfully",
      data: variants,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateVariantByVendor = async (req, res) => {
  const uploadedFileIds = [];

  try {
    const { productId, id } = req.params;

    const {
      sku,
      price,
      stock,
      images,
      isDefault,
      isActive,
    } = req.body;

    // -----------------------------------------
    // 1. Find logged-in vendor
    // -----------------------------------------

    const vendor = await Vendor.findOne({
      user: req.user._id,
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // -----------------------------------------
    // 2. Find product belonging to this vendor
    // -----------------------------------------

    const product = await Product.findOne({
      _id: productId,
      vendor: vendor._id,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or does not belong to this vendor",
      });
    }

    // -----------------------------------------
    // 3. Product must be approved
    // -----------------------------------------

    if (product.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Cannot update variant of an unapproved product",
      });
    }

    // -----------------------------------------
    // 4. Find variant belonging to this product
    // -----------------------------------------

    const variant = await ProductVariant.findOne({
      _id: id,
      product: product._id,
    });

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found or does not belong to this product",
      });
    }

    // -----------------------------------------
    // 5. Parse attributes
    // -----------------------------------------

    const attributes =
      req.body.attributes !== undefined
        ? parseArrayField(req.body.attributes)
        : undefined;

    // -----------------------------------------
    // 6. Check SKU uniqueness
    // -----------------------------------------

    if (sku && sku !== variant.sku) {
      const existingVariant = await ProductVariant.findOne({
        sku,
        _id: { $ne: variant._id },
      });

      if (existingVariant) {
        return res.status(409).json({
          success: false,
          message: "Variant SKU already exists",
        });
      }

      variant.sku = sku;
    }

    // -----------------------------------------
    // 7. Update basic fields
    // -----------------------------------------

    if (price !== undefined) {
      variant.price = price;
    }

    if (stock !== undefined) {
      variant.stock = stock;
    }

    if (isDefault !== undefined) {
      variant.isDefault = isDefault;
    }

    if (isActive !== undefined) {
      variant.isActive = isActive;
    }

    // -----------------------------------------
    // 8. Update attributes
    // -----------------------------------------

    if (attributes !== undefined) {
      await validateVariant(
        {
          sku: variant.sku,
          price: variant.price,
          attributes,
        },
        [],
      );

      await validateVariantAgainstSubCategory({
        subCategoryId: product.subCategory,
        attributes,
        sku: variant.sku,
      });

      variant.attributes = attributes;
    }

    // -----------------------------------------
    // 9. Update images
    // -----------------------------------------

    if (req.files && req.files.length > 0) {
      const oldImages = variant.images || [];

      const variantImages = [];

      // Upload new images
      for (const file of req.files) {
        const uploadedImage = await uploadFile({
          file: file.buffer,
          fileName: file.originalname,
          folder: "/product-variants",
        });

        uploadedFileIds.push(uploadedImage.file.fileId);

        variantImages.push({
          url: uploadedImage.file.url,
          alt: variant.sku,
          fileId: uploadedImage.file.fileId,
        });
      }

      // Existing images kept by frontend
      const existingImages =
        typeof req.body.existingImages === "string"
          ? JSON.parse(req.body.existingImages)
          : req.body.existingImages;

      if (Array.isArray(existingImages)) {
        variantImages.push(...existingImages);
      }

      variant.images = variantImages;

      // Delete old images from ImageKit
      for (const image of oldImages) {
        if (image.fileId) {
          await deleteFile(image.fileId);
        }
      }
    } else if (images !== undefined) {
      // No new files, but frontend may send image array
      const bodyImages =
        typeof images === "string"
          ? JSON.parse(images)
          : images;

      if (Array.isArray(bodyImages)) {
        variant.images = bodyImages;
      }
    }

    // -----------------------------------------
    // 10. Vendor update should go back to pending
    // -----------------------------------------

    variant.status = "pending";

    // -----------------------------------------
    // 11. Save
    // -----------------------------------------

    await variant.save();

    return res.status(200).json({
      success: true,
      message:
        "Variant updated successfully and sent for admin approval",
      data: variant,
    });

  } catch (error) {

    // Delete newly uploaded files if something failed
    for (const fileId of uploadedFileIds) {
      await deleteFile(fileId);
    }

    if (error instanceof ValidationError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const deleteVariantByVendor = async (req, res) => {
  try {
    const { productId, id } = req.params;

    // 1. Find vendor of logged-in user
    const vendor = await Vendor.findOne({
      user: req.user._id,
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // 2. Find product belonging to this vendor
    const product = await Product.findOne({
      _id: productId,
      vendor: vendor._id,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or does not belong to this vendor",
      });
    }

    // 3. Find variant belonging to this product
    const variant = await ProductVariant.findOne({
      _id: id,
      product: product._id,
    });

    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found or does not belong to this product",
      });
    }

    // 4. Delete images from ImageKit
    if (variant.images && variant.images.length > 0) {
      for (const image of variant.images) {
        if (image.fileId) {
          await deleteFile(image.fileId);
        }
      }
    }

    // 5. Delete variant
    await ProductVariant.findByIdAndDelete(variant._id);

    return res.status(200).json({
      success: true,
      message: "Variant deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
