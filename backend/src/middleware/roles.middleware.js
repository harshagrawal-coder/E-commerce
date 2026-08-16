import Vendor from "../models/vendor.model.js";
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this resource",
      });
    }

    next();
  };
};
export const requireApprovedVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findOne({
      user: req.user._id,
    });
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found",
      });
    }
    if (vendor.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Vendor is not approved",
      });
    }
    // Vendor is approved → continue to controller
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export default authorize;
