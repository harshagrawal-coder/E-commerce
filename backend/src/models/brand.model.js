import mongoose from "mongoose";
const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "brand name is required"],
        trim: true,
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
const Brand = mongoose.model("Brand", brandSchema)
export default Brand