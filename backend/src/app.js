import express from "express"
import authRouter from "./routes/auth.route.js"
import categoryRouter from "./routes/category.routes.js"
import subCategoryRouter from "./routes/subCategory.routes.js"
import brandRouter from "./routes/brand.routes.js"
const app = express()

app.use(express.json())
app.use("/api/auth", authRouter)
app.use("/api/category", categoryRouter)
app.use("/api/subcategory", subCategoryRouter)
app.use("/api/brand", brandRouter)


export default app