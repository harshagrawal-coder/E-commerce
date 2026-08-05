import mongoose from "mongoose"
import SubCategory from "./subCategory.model.js"
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "product name is required"],
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: [true, "description is required"],
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "categoryId is required"]
    },
    SubCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
        required: [true, "subCategoryId is required"]
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        required: [true, "brand is required"]
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
        required: [true, "Vendor is required"]
    },
    images: [
        {
            url: {
                type: String,
                required: true
            },
            alt: {
                type: String,
                required: true
            },
            fileId: {
                type: String,
                required: true
            }
        }
    ],
    isActive: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: true
    },
    rating: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        totalReviews: {
            type: Number,
            default: 0
        }
    },
    totalSold: {
        type: Number,
        default: 0
    },
    inventory: {
        sku: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },
        stock: {
            type: Number,
            required: true,
            default: 0,
            min: 0
        },
        lowStockThreshold: {
            type: Number,
            default: 5
        }
    },
}, {
    timestamps: true
})
const Product = mongoose.model("Product", productSchema)
export default Product