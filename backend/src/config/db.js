import mongoose from "mongoose";
import { config } from "./config.js";

const connectToDb = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            console.log("Already connected");
            return;
        }

        await mongoose.connect(config.MONGO_URI);

        console.log("Db connected");
    } catch (error) {
        console.log("Db not connected:", error.message);
        throw error;
    }
};

export default connectToDb;