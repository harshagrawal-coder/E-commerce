import slugify from "slugify";
import AttributeValue from "../models/attributesValue.model.js";

export const addAttributeValue = async (req, res) => {
    try {
        const { attribute, value, displayOrder, isDefault, isActive } = req.body;

        if (!attribute || !value) {
            return res.status(400).json({
                success: false,
                message: "Attribute and value are required"
            });
        }

        const slug = slugify(value, {
            lower: true,
            strict: true,
            trim: true
        });

        const existingAttributeValue = await AttributeValue.findOne({ attribute, value });

        if (existingAttributeValue) {
            return res.status(409).json({
                success: false,
                message: "Attribute value already exists for this attribute"
            });
        }

        const attributeValue = await AttributeValue.create({
            attribute,
            value,
            slug,
            displayOrder,
            isDefault,
            isActive
        });

        return res.status(201).json({
            success: true,
            message: "Attribute value created successfully",
            data: attributeValue
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getAttributeValue = async (req, res) => {
    try {
        const attributeValues = await AttributeValue.find().populate("attribute", "name slug");
        return res.status(200).json({
            success: true,
            message: "Attribute values fetched successfully",
            data: attributeValues
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateAttributeValue = async (req, res) => {
    try {
        const { attribute, value, displayOrder, isDefault, isActive } = req.body;
        const attributeValue = await AttributeValue.findById(req.params.id);

        if (!attributeValue) {
            return res.status(404).json({
                success: false,
                message: "Attribute value not found"
            });
        }

        if (value) {
            const slug = slugify(value, {
                lower: true,
                strict: true,
                trim: true
            });

            const filter = { value };
            if (attribute) {
                filter.attribute = attribute;
            }

            const existingAttributeValue = await AttributeValue.findOne(filter);

            if (existingAttributeValue && existingAttributeValue._id.toString() !== attributeValue._id.toString()) {
                return res.status(409).json({
                    success: false,
                    message: "Attribute value already exists for this attribute"
                });
            }

            attributeValue.value = value;
            attributeValue.slug = slug;
        }

        if (attribute !== undefined) {
            attributeValue.attribute = attribute;
        }

        if (displayOrder !== undefined) {
            attributeValue.displayOrder = displayOrder;
        }

        if (isDefault !== undefined) {
            attributeValue.isDefault = isDefault;
        }

        if (isActive !== undefined) {
            attributeValue.isActive = isActive;
        }

        await attributeValue.save();

        return res.status(200).json({
            success: true,
            message: "Attribute value updated successfully",
            data: attributeValue
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteAttributeValue = async (req, res) => {
    try {
        const attributeValue = await AttributeValue.findById(req.params.id);

        if (!attributeValue) {
            return res.status(404).json({
                success: false,
                message: "Attribute value not found"
            });
        }

        await AttributeValue.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Attribute value deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};