import slugify from "slugify";
import Product from "../models/product.models.js";
import ProductVariant from "../models/poductVariant.schema.js";
import Category from "../models/category.model.js";
import SubCategory from "../models/subCategory.model.js";
import Brand from "../models/brand.model.js";
import Attribute from "../models/attrubutes.model.js";
import AttributeValue from "../models/attributesValue.model.js";
import { uploadFile, deleteFile } from "../services/imagekit.js";
import {
  ValidationError,
  validateVariantAgainstSubCategory,
} from "../services/variantValidation.js";
import Vendor from "../models/vendor.model.js";

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
export const addProduct = async (req, res) => {
  const uploadedFileIds = [];
  try {
    const {
      name,
      description,
      category,
      subCategory,
      brand,
      vendor,
      images,
      isActive,
      isFeatured,
    } = req.body;
    const variants = req.body.variants || [];
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    const existingSubCategory = await SubCategory.findById(subCategory);
    if (!existingSubCategory) {
      return res.status(404).json({
        success: false,
        message: "Sub-category not found",
      });
    }
    const existingBrand = await Brand.findById(brand);
    if (!existingBrand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }
    if (
      existingSubCategory.category.toString() !==
      existingCategory._id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message: "Sub-category does not belong to the given category",
      });
    }

    const slug = slugify(name, {
      lower: true,
      strict: true,
      trim: true,
    });
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: "Product already exists",
      });
    }
    const productImages = [];
    if (req.files && req.files.length) {
      for (const file of req.files) {
        const uploadedImage = await uploadFile({
          file: file.buffer,
          fileName: file.originalname,
          folder: "/products",
        });
        uploadedFileIds.push(uploadedImage.file.fileId);
        productImages.push({
          url: uploadedImage.file.url,
          alt: name,
          fileId: uploadedImage.file.fileId,
        });
      }
      // Merge previously stored images (kept during edit) in their current order
      const existingImages =
        typeof req.body.existingImages === "string"
          ? JSON.parse(req.body.existingImages)
          : req.body.existingImages;
      if (Array.isArray(existingImages)) {
        productImages.push(...existingImages);
      }
    } else if (images && images.length) {
      productImages.push(...images);
    }

    const skus = [];
    for (const variant of variants) {
      await validateVariant(variant, skus);
      await validateVariantAgainstSubCategory({
        subCategoryId: existingSubCategory._id,
        attributes: variant.attributes,
        sku: variant.sku,
      });
    }

    const product = await Product.create({
      name,
      slug,
      description,
      category,
      subCategory,
      brand,
      vendor,
      images: productImages,
      isActive,
      isFeatured,
    });

    const createdVariants = [];
    for (const variant of variants) {
      const createdVariant = await ProductVariant.create({
        ...variant,
        product: product._id,
      });
      createdVariants.push(createdVariant);
    }
    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: {
        product,
        variants: createdVariants,
      },
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
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("vendor", "businessName")
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("brand", "name");

    const variantCounts = await ProductVariant.aggregate([
      { $group: { _id: "$product", count: { $sum: 1 } } },
    ]);

    const countMap = new Map(
      variantCounts.map((c) => [String(c._id), c.count]),
    );

    const data = products.map((product) => ({
      ...product.toObject(),
      variantsCount: countMap.get(String(product._id)) || 0,
    }));

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getProductDetailByAdmin = async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id)
    .populate("vendor", "businessName")
    .populate("category", "name")
    .populate("subCategory", "name")
    .populate("brand", "name");

  return res.status(200).json({
    success: false,
    message: "product detail fetched successfully",
    data: product,
  });
};
export const updateProduct = async (req, res) => {
  const uploadedFileIds = [];
  try {
    const {
      name,
      description,
      category,
      subCategory,
      brand,
      vendor,
      images,
      isActive,
      isFeatured,
      variants,
    } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (name) {
      const slug = slugify(name, {
        lower: true,
        strict: true,
        trim: true,
      });

      const existingProduct = await Product.findOne({ slug });

      if (
        existingProduct &&
        existingProduct._id.toString() !== product._id.toString()
      ) {
        return res.status(409).json({
          success: false,
          message: "Product already exists",
        });
      }
      product.name = name;
      product.slug = slug;
    }
    if (description !== undefined) {
      product.description = description;
    }

    if (category !== undefined) {
      const existingCategory = await Category.findById(category);
      if (!existingCategory) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
      product.category = category;
    }

    if (subCategory !== undefined) {
      const existingSubCategory = await SubCategory.findById(subCategory);
      if (!existingSubCategory) {
        return res.status(404).json({
          success: false,
          message: "Sub-category not found",
        });
      }
      product.subCategory = subCategory;
    }

    if (brand !== undefined) {
      const existingBrand = await Brand.findById(brand);
      if (!existingBrand) {
        return res.status(404).json({
          success: false,
          message: "Brand not found",
        });
      }
      product.brand = brand;
    }

    if (vendor !== undefined) {
      product.vendor = vendor;
    }

    if (images !== undefined) {
      product.images = images;
    }

    if (isActive !== undefined) {
      product.isActive = isActive;
    }

    if (isFeatured !== undefined) {
      product.isFeatured = isFeatured;
    }

    if (req.files && req.files.length) {
      const productImages = [];
      for (const file of req.files) {
        const uploadedImage = await uploadFile({
          file: file.buffer,
          fileName: file.originalname,
          folder: "/products",
        });
        uploadedFileIds.push(uploadedImage.file.fileId);
        productImages.push({
          url: uploadedImage.file.url,
          alt: name || product.name,
          fileId: uploadedImage.file.fileId,
        });
      }
      // Merge previously stored images (kept during edit) in their current order
      const existingImages =
        typeof req.body.existingImages === "string"
          ? JSON.parse(req.body.existingImages)
          : req.body.existingImages;
      if (Array.isArray(existingImages)) {
        productImages.push(...existingImages);
      }
      product.images = productImages;
    }

    await product.save();

    if (variants && variants.length) {
      const skus = [];
      for (const variant of variants) {
        if (variant._id) {
          if (variant.attributes && variant.attributes.length) {
            await validateVariantAgainstSubCategory({
              subCategoryId: product.subCategory,
              attributes: variant.attributes,
              sku: variant.sku,
            });
          }
          await ProductVariant.findByIdAndUpdate(variant._id, {
            ...variant,
            product: product._id,
          });
        } else {
          await validateVariant(variant, skus);
          await validateVariantAgainstSubCategory({
            subCategoryId: product.subCategory,
            attributes: variant.attributes,
            sku: variant.sku,
          });
          await ProductVariant.create({
            ...variant,
            product: product._id,
          });
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
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
export const updateProductStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "pending",
            "approved",
            "rejected",
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product status",
            });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        product.status = status;

        await product.save();

        return res.status(200).json({
            success: true,
            message: "Product status updated successfully",
            data: product,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const variants = await ProductVariant.find({ product: product._id });

    for (const variant of variants) {
      if (variant.images && variant.images.length) {
        for (const image of variant.images) {
          if (image.fileId) {
            await deleteFile(image.fileId);
          }
        }
      }
    }

    await ProductVariant.deleteMany({ product: product._id });

    if (product.images && product.images.length) {
      for (const image of product.images) {
        if (image.fileId) {
          await deleteFile(image.fileId);
        }
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const createProductByVendor = async (req, res) => {
  const uploadedFileIds = [];

  try {
    const {
      name,
      description,
      category,
      subCategory,
      brand,
      images,
      isActive,
      isFeatured,
    } = req.body;

    const variants = req.body.variants || [];

    // 1. Find vendor belonging to logged-in user
    const vendor = await Vendor.findOne({
      user: req.user._id,
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found",
      });
    }

    // 2. Check category
    const existingCategory = await Category.findById(category);

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // 3. Check sub-category
    const existingSubCategory = await SubCategory.findById(subCategory);

    if (!existingSubCategory) {
      return res.status(404).json({
        success: false,
        message: "Sub-category not found",
      });
    }

    // 4. Make sure sub-category belongs to category
    if (
      existingSubCategory.category.toString() !==
      existingCategory._id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message: "Sub-category does not belong to the given category",
      });
    }

    // 5. Check brand
    const existingBrand = await Brand.findById(brand);

    if (!existingBrand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    // 6. Generate slug
    const slug = slugify(name, {
      lower: true,
      strict: true,
      trim: true,
    });

    // 7. Check duplicate product
    const existingProduct = await Product.findOne({ slug });

    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: "Product already exists",
      });
    }

    // 8. Upload product images
    const productImages = [];

    if (req.files && req.files.length) {
      for (const file of req.files) {
        const uploadedImage = await uploadFile({
          file: file.buffer,
          fileName: file.originalname,
          folder: "/products",
        });

        uploadedFileIds.push(uploadedImage.file.fileId);

        productImages.push({
          url: uploadedImage.file.url,
          alt: name,
          fileId: uploadedImage.file.fileId,
        });
      }
    }

    // 9. Add existing images if provided
    const existingImages =
      typeof req.body.existingImages === "string"
        ? JSON.parse(req.body.existingImages)
        : req.body.existingImages;

    if (Array.isArray(existingImages)) {
      productImages.push(...existingImages);
    }

    // If images are directly provided and no files were uploaded
    if (!req.files?.length && Array.isArray(images)) {
      productImages.push(...images);
    }

    // 10. Validate variants
    const skus = [];

    for (const variant of variants) {
      await validateVariant(variant, skus);

      await validateVariantAgainstSubCategory({
        subCategoryId: existingSubCategory._id,
        attributes: variant.attributes,
        sku: variant.sku,
      });
    }

    // 11. Create product
    const product = await Product.create({
      name,
      slug,
      description,
      category: existingCategory._id,
      subCategory: existingSubCategory._id,
      brand: existingBrand._id,

      // IMPORTANT
      vendor: vendor._id,

      images: productImages,

      isActive,
      isFeatured,

      // Recommended for marketplace
      status: "pending",
    });

    // 12. Create variants
    const createdVariants = [];

    for (const variant of variants) {
      const createdVariant = await ProductVariant.create({
        ...variant,
        product: product._id,
      });

      createdVariants.push(createdVariant);
    }

    // 13. Success response
    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: {
        product,
        variants: createdVariants,
      },
    });
  } catch (error) {
    // Delete uploaded images if something fails
    for (const fileId of uploadedFileIds) {
      try {
        await deleteFile(fileId);
      } catch (deleteError) {
        console.error("Failed to delete uploaded file:", deleteError.message);
      }
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateProductByVendor = async (req, res) => {
  const uploadedFileIds = [];

  try {
    const {
      name,
      description,
      category,
      subCategory,
      brand,
      images,
      isActive,
      isFeatured,
      variants,
    } = req.body;

    // 1. Find vendor belonging to logged-in user
    const vendor = await Vendor.findOne({
      user: req.user._id,
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found",
      });
    }

    // 2. Find the product, scoped to this vendor only
    const product = await Product.findOne({
      _id: req.params.id,
      vendor: vendor._id,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 3. Update name + slug
    if (name) {
      const slug = slugify(name, {
        lower: true,
        strict: true,
        trim: true,
      });

      const existingProduct = await Product.findOne({ slug });

      if (
        existingProduct &&
        existingProduct._id.toString() !== product._id.toString()
      ) {
        return res.status(409).json({
          success: false,
          message: "Product already exists",
        });
      }

      product.name = name;
      product.slug = slug;
    }

    // 4. Update description
    if (description !== undefined) {
      product.description = description;
    }

    // 5. Update category
    if (category !== undefined) {
      const existingCategory = await Category.findById(category);

      if (!existingCategory) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      product.category = category;
    }

    // 6. Update sub-category
    if (subCategory !== undefined) {
      const existingSubCategory = await SubCategory.findById(subCategory);

      if (!existingSubCategory) {
        return res.status(404).json({
          success: false,
          message: "Sub-category not found",
        });
      }

      product.subCategory = subCategory;
    }

    // 7. Update brand
    if (brand !== undefined) {
      const existingBrand = await Brand.findById(brand);

      if (!existingBrand) {
        return res.status(404).json({
          success: false,
          message: "Brand not found",
        });
      }

      product.brand = brand;
    }

    // 8. Update flags
    if (isActive !== undefined) {
      product.isActive = isActive;
    }

    if (isFeatured !== undefined) {
      product.isFeatured = isFeatured;
    }

    // 9. Upload new images (if any), merging previously kept images
    if (req.files && req.files.length) {
      const productImages = [];

      for (const file of req.files) {
        const uploadedImage = await uploadFile({
          file: file.buffer,
          fileName: file.originalname,
          folder: "/products",
        });

        uploadedFileIds.push(uploadedImage.file.fileId);

        productImages.push({
          url: uploadedImage.file.url,
          alt: name || product.name,
          fileId: uploadedImage.file.fileId,
        });
      }

      const existingImages =
        typeof req.body.existingImages === "string"
          ? JSON.parse(req.body.existingImages)
          : req.body.existingImages;

      if (Array.isArray(existingImages)) {
        productImages.push(...existingImages);
      }

      product.images = productImages;
    } else if (images !== undefined) {
      product.images = images;
    }

    // 10. Upsert variants
    if (variants && variants.length) {
      const skus = [];

      for (const variant of variants) {
        if (variant._id) {
          if (variant.attributes && variant.attributes.length) {
            await validateVariantAgainstSubCategory({
              subCategoryId: product.subCategory,
              attributes: variant.attributes,
              sku: variant.sku,
            });
          }

          await ProductVariant.findByIdAndUpdate(variant._id, {
            ...variant,
            product: product._id,
          });
        } else {
          await validateVariant(variant, skus);
          await validateVariantAgainstSubCategory({
            subCategoryId: product.subCategory,
            attributes: variant.attributes,
            sku: variant.sku,
          });

          await ProductVariant.create({
            ...variant,
            product: product._id,
          });
        }
      }
    }

    // 11. Any edit sends the product back to pending for admin re-approval
    product.status = "pending";

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    // Delete newly uploaded images if anything fails
    for (const fileId of uploadedFileIds) {
      try {
        await deleteFile(fileId);
      } catch (deleteError) {
        console.error("Failed to delete uploaded file:", deleteError.message);
      }
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const deleteProductByVendor = async (req, res) => {
  try {
    // 1. Find vendor belonging to logged-in user
    const vendor = await Vendor.findOne({
      user: req.user._id,
    });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found",
      });
    }

    // 2. Find the product, scoped to this vendor only
    const product = await Product.findOne({
      _id: req.params.id,
      vendor: vendor._id,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 3. Delete product images from storage
    if (product.images && product.images.length) {
      for (const image of product.images) {
        if (image.fileId) {
          await deleteFile(image.fileId);
        }
      }
    }

    // 4. Delete variant images from storage
    const variants = await ProductVariant.find({ product: product._id });

    for (const variant of variants) {
      if (variant.images && variant.images.length) {
        for (const image of variant.images) {
          if (image.fileId) {
            await deleteFile(image.fileId);
          }
        }
      }
    }

    // 5. Delete variants and product
    await ProductVariant.deleteMany({ product: product._id });
    await Product.findByIdAndDelete(product._id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getProductByVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      user: req.user._id,
    });
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }
    const products = await Product.find({
      vendor: vendor._id,
    })
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("brand", "name");

    const variants = await ProductVariant.find()
      .populate("attributes.attribute", "name slug")
      .populate("attributes.value", "value slug");

    const variantsByProduct = variants.reduce((acc, variant) => {
      const key = variant.product.toString();
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(variant);
      return acc;
    }, {});

    const data = products.map((product) => ({
      ...product.toObject(),
      variants: variantsByProduct[product._id.toString()] || [],
    }));

    return res.status(200).json({
      success: true,
      message: "Vendor products fetched successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
