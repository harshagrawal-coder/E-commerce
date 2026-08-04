import slugify from "slugify";
import Brand from "../models/brand.model.js";
import { uploadFile, deleteFile } from "../services/imagekit.js";
export const addBrand = async (req, res) => {
    let uploadedFileId = null;
    try {
        const { name, description } = req.body;
        // Validate input
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Brand name is required"
            });
        }
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Brand image is required"
            });
        }
        // Generate slug
        const slug = slugify(name, {
            lower: true,
            strict: true,
            trim: true
        });
        // Check duplicate Brand
        const existingBrand = await Brand.findOne({ slug });
        if (existingBrand) {
            return res.status(409).json({
                success: false,
                message: "Brand already exists"
            });
        }
        // Upload image to ImageKit
        const uploadedImage = await uploadFile({
            file: req.file.buffer,
            fileName: req.file.originalname,
            folder: "/brands"
        });
        uploadedFileId = uploadedImage.file.fileId;
        // Create Brand
        const brand = await Brand.create({
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
            message: "Brand created successfully",
            data: brand
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
export const getBrand = async (req, res) => {
    const brands = await Brand.find()
    return res.status(200).json({
        success: true,
        message: "Brands fetched successfully",
        data: brands
    })
}
export const updateBrand = async (req, res) => {
    let uploadedFileId = null;

    try {
        const { name, description } = req.body;
        const brand = await Brand.findById(req.params.id);

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: "Brand not found"
            });
        }

        if (name) {
            const slug = slugify(name, {
                lower: true,
                strict: true,
                trim: true
            });

            const existingBrand = await Brand.findOne({ slug });

            if (existingBrand && existingBrand._id.toString() !== brand._id.toString()) {
                return res.status(409).json({
                    success: false,
                    message: "Brand already exists"
                });
            }

            brand.name = name;
            brand.slug = slug;
        }

        if (description !== undefined) {
            brand.description = description;
        }

        if (req.file) {
            const oldFileId = brand.image.fileId;

            const uploadedImage = await uploadFile({
                file: req.file.buffer,
                fileName: req.file.originalname,
                folder: "/brands"
            });

            uploadedFileId = uploadedImage.file.fileId;

            brand.image = {
                url: uploadedImage.file.url,
                fileId: uploadedImage.file.fileId,
                alt: name || brand.name
            };

            if (oldFileId) {
                await deleteFile(oldFileId);
            }
        }

        await brand.save();

        return res.status(200).json({
            success: true,
            message: "Brand updated successfully",
            brand
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
export const deleteBrand = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: "Brand not found"
            });
        }

        if (brand.image.fileId) {
            await deleteFile(brand.image.fileId);
        }

        await Brand.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Brand deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};