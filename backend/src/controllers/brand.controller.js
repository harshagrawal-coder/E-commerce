import slugify from "slugify";
import Brand from "../models/brand.model.js";
import SubCategory from "../models/subCategory.model.js";

export const addBrand = async (req, res) => {
    try {
        const { name, isActive } = req.body;
        const subCategories = req.body.subCategories || [];
        // Validate input
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Brand name is required"
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
        // Validate sub categories
        if (subCategories.length) {
            const subCategoriesCount = await SubCategory.countDocuments({
                _id: { $in: subCategories }
            });
            if (subCategoriesCount !== subCategories.length) {
                return res.status(404).json({
                    success: false,
                    message: "One or more sub-categories not found"
                });
            }
        }
        
        // Create Brand
        const brand = await Brand.create({
            name,
            slug,
            subCategories,
            isActive
        });

        return res.status(201).json({
            success: true,
            message: "Brand created successfully",
            data: brand
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const getBrand = async (req, res) => {
    const brands = await Brand.find().populate("subCategories", "name slug");
    return res.status(200).json({
        success: true,
        message: "Brands fetched successfully",
        data: brands
    })
}
export const updateBrand = async (req, res) => {
    try {
        const { name, isActive } = req.body;
        const subCategories = req.body.subCategories || [];
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

        if (subCategories.length) {
            const subCategoriesCount = await SubCategory.countDocuments({
                _id: { $in: subCategories }
            });
            if (subCategoriesCount !== subCategories.length) {
                return res.status(404).json({
                    success: false,
                    message: "One or more sub-categories not found"
                });
            }
            brand.subCategories = subCategories;
        }

        if (isActive !== undefined) {
            brand.isActive = isActive;
        }

        await brand.save();

        return res.status(200).json({
            success: true,
            message: "Brand updated successfully",
            brand
        });

    } catch (error) {

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
