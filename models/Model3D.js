// Model3D.js
import mongoose from "mongoose";

const model3DSchema = new mongoose.Schema({
  name: { type: String, required: true },
  author: { type: String },
  description: { type: String },
  // Store the GridFS filename
  filePath: { type: String, required: true },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

const Model3D = mongoose.model("Model3D", model3DSchema);

export default Model3D;
