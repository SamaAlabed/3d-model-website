// model3d.js
import mongoose from "mongoose";

const model3DSchema = new mongoose.Schema({
  name: String,
  author: String,
  description: String,
  // This field will now store the full Cloudinary URL
  filePath: String, 
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Model3D = mongoose.model("Model3D", model3DSchema);

export default Model3D;
