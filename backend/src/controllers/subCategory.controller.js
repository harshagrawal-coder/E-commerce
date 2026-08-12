import slugify from "slugify";
import Category from "../models/category.model.js";
import Attribute from "../models/attrubutes.model.js";
import AttributeValue from "../models/attributesValue.model.js";
import SubCategory from "../models/subCategory.model.js";
import { uploadFile, deleteFile } from "../services/imagekit.js";

const parseAllowedAttributes = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    return JSON.parse(value);
  } catch {
    throw new Error("Invalid allowedAttributes format");
  }
};
const validateAllowedAttributes = async (allowedAttributes) => {
  if (!Array.isArray(allowedAttributes)) {
    throw new Error("allowedAttributes must be an array");
  }

  const duplicate = allowedAttributes.some(
    (item, index) =>
      allowedAttributes.findIndex(
        (attr) => attr.attribute.toString() === item.attribute.toString(),
      ) !== index,
  );

  if (duplicate) {
    throw new Error("Duplicate attribute found");
  }
  for (const item of allowedAttributes) {
    if (!item.attribute) {
      throw new Error("Attribute id is required");
    }
    const attribute = await Attribute.findById(item.attribute);
    if (!attribute) {
      throw new Error(`Attribute ${item.attribute} not found`);
    }
    if (!attribute.isActive) {
      throw new Error(`Attribute "${attribute.name}" is inactive and cannot be connected`);
    }

    if (item.allowedValues && item.allowedValues.length) {
      const duplicateValues = item.allowedValues.some(
        (value, index) =>
          item.allowedValues.findIndex((v) => v.toString() === value.toString()) !==
          index,
      );
      if (duplicateValues) {
        throw new Error(
          `Duplicate values found for attribute "${attribute.name}"`,
        );
      }

      const values = await AttributeValue.find({
        _id: { $in: item.allowedValues },
        attribute: item.attribute,
      });

      if (values.length !== item.allowedValues.length) {
        const foundIds = new Set(values.map((v) => v._id.toString()));
        const missing = item.allowedValues
          .filter((id) => !foundIds.has(id.toString()))
          .map((id) => id.toString());
        throw new Error(
          `Invalid allowedValues for attribute "${attribute.name}": ${missing.join(", ")}`,
        );
      }

      for (const value of values) {
        if (!value.isActive) {
          throw new Error(
            `Value "${value.value}" is inactive and cannot be connected to attribute "${attribute.name}"`,
          );
        }
      }
    }
  }
};
export const addSubCategory = async (req, res) => {
  let uploadedFileId = null;
  try {
    const { name, description, category } = req.body;
    const allowedAttributes = parseAllowedAttributes(
      req.body.allowedAttributes,
    );

    if (!category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Sub-category name is required",
      });
    }
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Sub-category image is required",
      });
    }
    const slug = slugify(name, {
      lower: true,
      strict: true,
      trim: true,
    });
    const existingSubCategory = await SubCategory.findOne({ slug });
    if (existingSubCategory) {
      return res.status(409).json({
        success: false,
        message: "Sub-category already exists",
      });
    }
    const uploadedImage = await uploadFile({
      file: req.file.buffer,
      fileName: req.file.originalname,
      folder: "/subcategories",
    });
    uploadedFileId = uploadedImage.file.fileId;
    const subCategory = await SubCategory.create({
      name,
      slug,
      description,
      category,
      image: {
        url: uploadedImage.file.url,
        fileId: uploadedImage.file.fileId,
        alt: name,
      },
      allowedAttributes,
    });
    await subCategory.populate("category", "name slug");
    return res.status(201).json({
      success: true,
      message: "Sub-category created successfully",
      subCategory,
    });
  } catch (error) {
    if (uploadedFileId) {
      await deleteFile(uploadedFileId);
    }
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getSubCategory = async (req, res) => {
  const subCategories = await SubCategory.find()
    .populate("category", "name slug")
    .populate({
      path: "allowedAttributes.attribute",
      model: Attribute,
    })
    .populate({
      path: "allowedAttributes.allowedValues",
      model: AttributeValue,
    });
  return res.status(200).json({
    success: true,
    message: "Sub-categories fetched successfully",
    data: subCategories,
  });
};
export const updateSubCategory = async (req, res) => {
  let uploadedFileId = null;

  try {
    const { name, description, category } = req.body;
    const allowedAttributes = parseAllowedAttributes(
      req.body.allowedAttributes,
    );
    const subCategory = await SubCategory.findById(req.params.id);

    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: "Sub-category not found",
      });
    }

    if (name) {
      await validateAllowedAttributes(allowedAttributes);
      const slug = slugify(name, {
        lower: true,
        strict: true,
        trim: true,
      });

      const existingSubCategory = await SubCategory.findOne({ slug });

      if (
        existingSubCategory &&
        existingSubCategory._id.toString() !== subCategory._id.toString()
      ) {
        return res.status(409).json({
          success: false,
          message: "Sub-category already exists",
        });
      }

      subCategory.name = name;
      subCategory.slug = slug;
    }

    if (description !== undefined) {
      subCategory.description = description;
    }

    if (category !== undefined) {
      const existingCategory = await Category.findById(category);

      if (!existingCategory) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      subCategory.category = category;
    }

    if (
      req.body.allowedAttributes !== undefined &&
      req.body.allowedAttributes !== null &&
      req.body.allowedAttributes !== ""
    ) {
      await validateAllowedAttributes(allowedAttributes);
      subCategory.allowedAttributes = allowedAttributes;
    }

    if (req.file) {
      const oldFileId = subCategory.image.fileId;

      const uploadedImage = await uploadFile({
        file: req.file.buffer,
        fileName: req.file.originalname,
        folder: "/subcategories",
      });

      uploadedFileId = uploadedImage.file.fileId;

      subCategory.image = {
        url: uploadedImage.file.url,
        fileId: uploadedImage.file.fileId,
        alt: name || subCategory.name,
      };

      if (oldFileId) {
        await deleteFile(oldFileId);
      }
    }

    await subCategory.save();

    return res.status(200).json({
      success: true,
      message: "Sub-category updated successfully",
      subCategory,
    });
  } catch (error) {
    if (uploadedFileId) {
      await deleteFile(uploadedFileId);
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const deleteSubCategory = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id);

    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: "Sub-category not found",
      });
    }

    if (subCategory.image.fileId) {
      await deleteFile(subCategory.image.fileId);
    }

    await SubCategory.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Sub-category deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
