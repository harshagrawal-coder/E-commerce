import dotenv from "dotenv"

dotenv.config()

export const config = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/e-commerce",
    JWT_SECRET: process.env.JWT_SECRET,
    PUBLIC_KEY:process.env.PUBLIC_KEY,
    PRIVATE_KEY:process.env.PRIVATE_KEY,
    URL_ENDPOINT_KEY:process.env.URL_ENDPOINT_KEY
}

