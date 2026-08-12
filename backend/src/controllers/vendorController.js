import Vendor from "../models/vendor.model.js";
import User from "../models/user.model.js";
import { uploadFile, deleteFile } from "../services/imagekit.js";
export const createVendor = async (req, res) => {
  let uploadedFileId = null;
  try {
    const { businessName, businessType, description, address, phone } =
      req.body;
    // Logged-in user comes from authMiddleware
    const userId = req.user._id;
    // Vendor image is required
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Vendor image is required",
      });
    }
    // Check that logged-in user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // Make sure this user is actually a vendor
    if (user.role !== "vendor") {
      return res.status(403).json({
        success: false,
        message: "Only vendor users can create a vendor profile",
      });
    }
    // Check whether vendor profile already exists
    const existingVendor = await Vendor.findOne({
      user: userId,
    });
    if (existingVendor) {
      return res.status(409).json({
        success: false,
        message: "Vendor profile already exists",
      });
    }
    // Upload vendor image
    const uploadedImage = await uploadFile({
      file: req.file.buffer,
      fileName: req.file.originalname,
      folder: "/vendors",
    });
    uploadedFileId = uploadedImage.file.fileId;
    // Create vendor profile
    const vendor = await Vendor.create({
      user: userId,
      image: {
        url: uploadedImage.file.url,
        alt: businessName,
        fileId: uploadedImage.file.fileId,
      },
      businessName,
      businessType,
      description,
      address,
      phone,
      // Vendor must wait for admin approval
      status: "pending",
      // New vendor is active by default
      isActive: true,
    });
    return res.status(201).json({
      success: true,
      message: "Vendor application submitted successfully",
      data: vendor,
    });
  } catch (error) {
    // If database creation fails after image upload,
    // remove the uploaded image so we don't leave an orphan file.
    if (uploadedFileId) {
      try {
        await deleteFile(uploadedFileId);
      } catch (deleteError) {
        console.error(
          "Failed to delete uploaded vendor image:",
          deleteError.message,
        );
      }
    }
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      user: req.user._id,
    }).populate("user", "name email role");
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Vendor fetched successfully",
      data: vendor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateVendor = async (req, res) => {
  const {} = req.body   ;
};
