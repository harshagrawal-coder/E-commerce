import mongoose from "mongoose";
const attributeValueSchema = new mongoose.Schema(
    {
        attribute: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Attribute",
            required: [true, "Attribute is required"]
        },
        value: {
            type: String,
            required: [true, "Value is required"],
            trim: true
        },
        slug: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        displayOrder: {
            type: Number,
            default: 0
        },
        isDefault: {
            type: Boolean,
            default: false
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

// Prevent duplicate values under the same attribute
attributeValueSchema.index(
    { attribute: 1, value: 1 },
    { unique: true }
);
const AttributeValue = mongoose.model(
    "AttributeValue",
    attributeValueSchema
);
export default AttributeValue;