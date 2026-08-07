import slugify from "slugify";
import Attribute from "../models/attrubutes.model.js";

export const addAttribute = async (req, res) => {
    try {
        const { name, inputType, isVariant, isFilterable, isRequired, isActive, displayOrder } = req.body;
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Attribute name is required"
            });
        }
        const slug = slugify(name, {
            lower: true,
            strict: true,
            trim: true
        });
        const existingAttribute = await Attribute.findOne({ slug });
        if (existingAttribute) {
            return res.status(409).json({
                success: false,
                message: "Attribute already exists"
            });
        }
        const attribute = await Attribute.create({
            name,
            slug,
            inputType,
            isVariant,
            isFilterable,
            isRequired,
            isActive,
            displayOrder
        });
        return res.status(201).json({
            success: true,
            message: "Attribute created successfully",
            data: attribute
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const getAttribute = async (req, res) => {
    try {
        const attributes = await Attribute.find();
        return res.status(200).json({
            success: true,
            message: "Attributes fetched successfully",
            data: attributes
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const updateAttribute = async (req, res) => {
    try {
        const { name,inputType, isVariant, isFilterable, isRequired, isActive, displayOrder } = req.body;
        const attribute = await Attribute.findById(req.params.id);

        if (!attribute) {
            return res.status(404).json({
                success: false,
                message: "Attribute not found"
            });
        }
        if (name) {
            const slug = slugify(name, {
                lower: true,
                strict: true,
                trim: true
            });
            const existingAttribute = await Attribute.findOne({ slug });

            if (existingAttribute && existingAttribute._id.toString() !== attribute._id.toString()) {
                return res.status(409).json({
                    success: false,
                    message: "Attribute already exists"
                });
            }

            attribute.name = name;
            attribute.slug = slug;
        }
        if (inputType !== undefined) {
            attribute.inputType = inputType;
        }

        if (isVariant !== undefined) {
            attribute.isVariant = isVariant;
        }

        if (isFilterable !== undefined) {
            attribute.isFilterable = isFilterable;
        }

        if (isRequired !== undefined) {
            attribute.isRequired = isRequired;
        }

        if (isActive !== undefined) {
            attribute.isActive = isActive;
        }

        if (displayOrder !== undefined) {
            attribute.displayOrder = displayOrder;
        }

        await attribute.save();

        return res.status(200).json({
            success: true,
            message: "Attribute updated successfully",
            data: attribute
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteAttribute = async (req, res) => {
    try {
        const attribute = await Attribute.findById(req.params.id);

        if (!attribute) {
            return res.status(404).json({
                success: false,
                message: "Attribute not found"
            });
        }

        await Attribute.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Attribute deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
