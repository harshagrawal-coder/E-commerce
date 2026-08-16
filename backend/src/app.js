import express from "express";
import authRouter from "./routes/auth.route.js";
import categoryRouter from "./routes/category.routes.js";
import subCategoryRouter from "./routes/subCategory.routes.js";
import brandRouter from "./routes/brand.routes.js";
import attributeRouter from "./routes/attribute.routes.js";
import attributeValueRouter from "./routes/attributesValue.routes.js";
import productRouter from "./routes/adminProduct.routes.js";
import vendorProductRouter from "./routes/vendorProduct.routes.js";
import productVariantRouter from "./routes/productVariant.routes.js";
import adminRouter from "./routes/admin.routes.js";
import vendorRouter from "./routes/vendor.routes.js";
import cors from "cors";
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/category", categoryRouter);
app.use("/api/subcategory", subCategoryRouter);
app.use("/api/brand", brandRouter);
app.use("/api/attribute", attributeRouter);
app.use("/api/attribute-value", attributeValueRouter);
app.use("/api/product", productRouter);
app.use("/api/vendor/products", vendorProductRouter);
app.use("/api/variant", productVariantRouter);
app.use("/api/vendor", vendorRouter);
app.use("/api/admin", adminRouter);

export default app;
