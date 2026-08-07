import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "category name is required"],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
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
      },
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
const Category = mongoose.model("Category", categorySchema);
export default Category;
