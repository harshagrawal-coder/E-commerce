import ProductVariant from "../models/poductVariant.schema.js";
import Product from "../models/product.models.js";
import Attribute from "../models/attrubutes.model.js";
import AttributeValue from "../models/attributesValue.model.js";
import { uploadFile, deleteFile } from "../services/imagekit.js";

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
                throw new Error(`Attribute and value are required for variant ${variant.sku}`);
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
                attribute: attr.attribute
            });
            if (!attributeValue) {
                throw new Error(`Invalid value for attribute ${attr.attribute}`);
            }
        }
    }
};
export const addVariant = async (req, res) => {
    const uploadedFileIds = [];
    try {
        const { productId } = req.params;
        const { sku, price, stock, images, isDefault, isActive } = req.body;
        const attributes = req.body.attributes || [];

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const existingVariant = await ProductVariant.findOne({ sku });
        if (existingVariant) {
            return res.status(409).json({
                success: false,
                message: "Variant sku already exists"
            });
        }

        await validateVariant({ sku, price, attributes }, []);

        const variantImages = [];
        if (req.files && req.files.length) {
            for (const file of req.files) {
                const uploadedImage = await uploadFile({
                    file: file.buffer,
                    fileName: file.originalname,
                    folder: "/product-variants"
                });
                uploadedFileIds.push(uploadedImage.file.fileId);
                variantImages.push({
                    url: uploadedImage.file.url,
                    alt: sku,
                    fileId: uploadedImage.file.fileId
                });
            }
        } else if (images && images.length) {
            variantImages.push(...images);
        }

        const variant = await ProductVariant.create({
            product: productId,
            sku,
            attributes,
            price,
            stock,
            images: variantImages,
            isDefault,
            isActive
        });

        return res.status(201).json({
            success: true,
            message: "Product variant created successfully",
            data: variant
        });

    } catch (error) {

        for (const fileId of uploadedFileIds) {
            await deleteFile(fileId);
        }

        return res.status(500).json({
            success: false,
            message: error.message
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
                message: "Product not found"
            });
        }

        const variants = await ProductVariant.find({ product: productId })
            .populate("attributes.attribute", "name slug")
            .populate("attributes.value", "value slug");

        return res.status(200).json({
            success: true,
            message: "Product variants fetched successfully",
            data: variants
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
export const updateVariant = async (req, res) => {
    const uploadedFileIds = [];
    try {
        const { productId, id } = req.params;
        const { sku, price, stock, images, isDefault, isActive } = req.body;
        const attributes = req.body.attributes || [];

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const variant = await ProductVariant.findOne({ _id: id, product: productId });
        if (!variant) {
            return res.status(404).json({
                success: false,
                message: "Product variant not found"
            });
        }

        if (sku) {
            const existingVariant = await ProductVariant.findOne({ sku });
            if (existingVariant && existingVariant._id.toString() !== variant._id.toString()) {
                return res.status(409).json({
                    success: false,
                    message: "Variant sku already exists"
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
            await validateVariant({ sku: variant.sku, price: variant.price, attributes }, []);
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
                    folder: "/product-variants"
                });
                uploadedFileIds.push(uploadedImage.file.fileId);
                variantImages.push({
                    url: uploadedImage.file.url,
                    alt: variant.sku,
                    fileId: uploadedImage.file.fileId
                });
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
            data: variant
        });

    } catch (error) {

        for (const fileId of uploadedFileIds) {
            await deleteFile(fileId);
        }

        return res.status(500).json({
            success: false,
            message: error.message
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
                message: "Product not found"
            });
        }

        const variant = await ProductVariant.findOne({ _id: id, product: productId });
        if (!variant) {
            return res.status(404).json({
                success: false,
                message: "Product variant not found"
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
            message: "Product variant deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
