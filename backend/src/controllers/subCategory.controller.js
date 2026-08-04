import slugify from "slugify";
import Category from "../models/category.model.js";
import SubCategory from "../models/subCategory.model.js";
import { uploadFile, deleteFile } from "../services/imagekit.js";

export const addSubCategory = async (req, res) => {
    let uploadedFileId = null;

    try {
        const { name, description, category } = req.body;

        if (!category) {
            return res.status(400).json({
                success: false,
                message: "Category is required"
            });
        }

        const existingCategory = await Category.findById(category);

        if (!existingCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Sub-category name is required"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Sub-category image is required"
            });
        }

        const slug = slugify(name, {
            lower: true,
            strict: true,
            trim: true
        });
        const existingSubCategory = await SubCategory.findOne({ slug });

        if (existingSubCategory) {
            return res.status(409).json({
                success: false,
                message: "Sub-category already exists"
            });
        }

        const uploadedImage = await uploadFile({
            file: req.file.buffer,
            fileName: req.file.originalname,
            folder: "/subcategories"
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
                alt: name
            }
        });

        return res.status(201).json({
            success: true,
            message: "Sub-category created successfully",
            subCategory
        });

    } catch (error) {

        if (uploadedFileId) {
            await deleteFile(uploadedFileId);
        }

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const getSubCategory = async (req, res) => {
    const subCategories = await SubCategory.find().populate("category", "name slug")
    return res.status(200).json({
        success: true,
        message: "Sub-categories fetched successfully",
        data: subCategories
    })
}
export const updateSubCategory = async (req, res) => {
    let uploadedFileId = null;

    try {
        const { name, description, category } = req.body;
        const subCategory = await SubCategory.findById(req.params.id);

        if (!subCategory) {
            return res.status(404).json({
                success: false,
                message: "Sub-category not found"
            });
        }

        if (name) {
            const slug = slugify(name, {
                lower: true,
                strict: true,
                trim: true
            });

            const existingSubCategory = await SubCategory.findOne({ slug });

            if (existingSubCategory && existingSubCategory._id.toString() !== subCategory._id.toString()) {
                return res.status(409).json({
                    success: false,
                    message: "Sub-category already exists"
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
                    message: "Category not found"
                });
            }

            subCategory.category = category;
        }

        if (req.file) {
            const oldFileId = subCategory.image.fileId;

            const uploadedImage = await uploadFile({
                file: req.file.buffer,
                fileName: req.file.originalname,
                folder: "/subcategories"
            });

            uploadedFileId = uploadedImage.file.fileId;

            subCategory.image = {
                url: uploadedImage.file.url,
                fileId: uploadedImage.file.fileId,
                alt: name || subCategory.name
            };

            if (oldFileId) {
                await deleteFile(oldFileId);
            }
        }

        await subCategory.save();

        return res.status(200).json({
            success: true,
            message: "Sub-category updated successfully",
            subCategory
        });

    } catch (error) {

        if (uploadedFileId) {
            await deleteFile(uploadedFileId);
        }

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const deleteSubCategory = async (req, res) => {
    try {
        const subCategory = await SubCategory.findById(req.params.id);

        if (!subCategory) {
            return res.status(404).json({
                success: false,
                message: "Sub-category not found"
            });
        }

        if (subCategory.image.fileId) {
            await deleteFile(subCategory.image.fileId);
        }

        await SubCategory.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Sub-category deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
