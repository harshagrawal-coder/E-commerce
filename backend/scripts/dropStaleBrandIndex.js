import mongoose from "mongoose";
import { config } from "../src/config/config.js";

async function dropStaleBrandImageIndex() {
  try {
    await mongoose.connect(config.MONGO_URI);
    const db = mongoose.connection.db;

    const indexes = await db.collection("brands").indexes();
    const staleIndex = indexes.find((idx) => idx.name === "image.fileId_1");

    if (!staleIndex) {
      console.log("No stale 'image.fileId_1' index found on brands collection.");
    } else {
      await db.collection("brands").dropIndex("image.fileId_1");
      console.log("Dropped stale index: image.fileId_1");
    }
  } catch (error) {
    console.error("Failed to drop index:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

dropStaleBrandImageIndex();
