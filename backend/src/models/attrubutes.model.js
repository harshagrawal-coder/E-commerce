import mongoose from "mongoose";
const attributeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Attribute name is required"],
            trim: true,
            unique: true
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        description: {
            type: String,
            trim: true,
            default: ""
        },
        inputType: {
            type: String,
            enum: [
                "select",
                "multiselect",
                "text",
                "number",
                "boolean"
            ],
            default: "select"
        },
        isVariant: {
            type: Boolean,
            default: false
        },
        isFilterable: {
            type: Boolean,
            default: true
        },
        isRequired: {
            type: Boolean,
            default: false
        },
        isActive: {
            type: Boolean,
            default: true
        },
        displayOrder: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);
const Attribute = mongoose.model("Attribute", attributeSchema);
export default Attribute;