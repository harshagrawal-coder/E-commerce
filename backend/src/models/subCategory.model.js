import mongoose from "mongoose";

const allowedAttributeSchema = new mongoose.Schema(
  {
    attribute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attribute",
      required: true,
    },
    allowedValues: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AttributeValue",
      },
    ],
    required: {
      type: Boolean,
      default: false,
    },
    // Creates product variants
    isVariant: {
      type: Boolean,
      default: false,
    },
    // Show in product filters
    isFilterable: {
      type: Boolean,
      default: true,
    },
    // Show on product details page
    isVisible: {
      type: Boolean,
      default: true,
    },
    // Display sequence in frontend/admin
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  },
);
const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Sub-category name is required"],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    image: {
      url: {
        type: String,
        default: "",
      },
      alt: {
        type: String,
        default: "",
      },
      fileId: {
        type: String,
        trim: true,
        unique: true,
        sparse: true,
      },
    },
    allowedAttributes: {
      type: [allowedAttributeSchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);
const SubCategory = mongoose.model("SubCategory", subCategorySchema);
export default SubCategory;
