import mongoose from "mongoose"

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "sub-category name is required"],
        trim: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        trim: true,
        default: ""
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "category is required"]
    },
    image: {
        url: {
            type: String,
            default: ""
        },
        alt: {
            type: String,
            default: ""
        },
        fileId: {
            type: String,
            trim: true,
            unique: true
        }
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})
const SubCategory = mongoose.model("SubCategory", subCategorySchema)

export default SubCategory
