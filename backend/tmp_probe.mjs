import mongoose from "mongoose";
import { config } from "./src/config/config.js";
await mongoose.connect(config.MONGO_URI);
console.log("MONGO_URI:", config.MONGO_URI);
console.log("db name:", mongoose.connection.db.databaseName);
const Attribute = mongoose.model("Attribute", new mongoose.Schema({}, { strict: false }));
const AttributeValue = mongoose.model("AttributeValue", new mongoose.Schema({}, { strict: false }));
console.log(
  "Attribute docs:",
  JSON.stringify(await Attribute.find().select("name slug _id").lean())
);
console.log(
  "AttributeValue docs:",
  JSON.stringify(await AttributeValue.find().select("attribute value _id").lean())
);
await mongoose.disconnect();