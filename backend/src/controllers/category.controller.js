import slugify from "slugify";
import Category from "../models/category.model.js";
import { uploadFile, deleteFile } from "../services/imagekit.js";

export const addCategory = async (req, res) => {
    let uploadedFileId = null;

    try {
        const { name, description } = req.body;

        // Validate input
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Category name is required"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Category image is required"
            });
        }

        // Generate slug
        const slug = slugify(name, {
            lower: true,
            strict: true,
            trim: true
        });

        // Check duplicate category
        const existingCategory = await Category.findOne({ slug });

        if (existingCategory) {
            return res.status(409).json({
                success: false,
                message: "Category already exists"
            });
        }

        // Upload image to ImageKit
        const uploadedImage = await uploadFile({
            file: req.file.buffer,
            fileName: req.file.originalname,
            folder: "/categories"
        });

        uploadedFileId = uploadedImage.file.fileId;

        // Create category
        const category = await Category.create({
            name,
            slug,
            description,
            image: {
                url: uploadedImage.file.url,
                fileId: uploadedImage.file.fileId,
                alt: name
            }
        });

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            category
        });

    } catch (error) {

        // Rollback uploaded image
        if (uploadedFileId) {
            await deleteFile(uploadedFileId);
        }

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const getCategory = async (req, res) => {
    const categories = await Category.find()
    return res.status(200).json({
        success: true,
        message: "categories fetched successfully",
        data: categories
    })
}
export const updateCategory = async (req, res) => {
    let uploadedFileId = null;

    try {
        const { name, description } = req.body;
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        if (name) {
            const slug = slugify(name, {
                lower: true,
                strict: true,
                trim: true
            });

            const existingCategory = await Category.findOne({ slug });

            if (existingCategory && existingCategory._id.toString() !== category._id.toString()) {
                return res.status(409).json({
                    success: false,
                    message: "Category already exists"
                });
            }

            category.name = name;
            category.slug = slug;
        }

        if (description !== undefined) {
            category.description = description;
        }

        if (req.file) {
            const oldFileId = category.image.fileId;

            const uploadedImage = await uploadFile({
                file: req.file.buffer,
                fileName: req.file.originalname,
                folder: "/categories"
            });

            uploadedFileId = uploadedImage.file.fileId;

            category.image = {
                url: uploadedImage.file.url,
                fileId: uploadedImage.file.fileId,
                alt: name || category.name
            };

            if (oldFileId) {
                await deleteFile(oldFileId);
            }
        }

        await category.save();

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category
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
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        if (category.image.fileId) {
            await deleteFile(category.image.fileId);
        }

        await Category.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};