
// server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Model3D from './models/Model3D.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----------------------------------------------------------------
// 1. MONGOOSE MODEL
// ----------------------------------------------------------------
const modelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  author: { type: String },
  description: { type: String },
  filePath: { type: String, required: true }
}, { timestamps: true });

const Model = mongoose.model('Model', modelSchema);

// ----------------------------------------------------------------
// 2. LOCAL STORAGE CONFIGURATION (Multer)
// ----------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// ----------------------------------------------------------------
// 3. UPLOAD ROUTE
// ----------------------------------------------------------------
app.post('/api/upload', upload.single('modelFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    // Save to MongoDB
    const newModel = new Model({
      name: req.body.name,
      author: req.body.author,
      description: req.body.description,
      filePath: fileUrl
    });
    await newModel.save();

    res.status(200).json({
      message: 'Model uploaded successfully.',
      modelUrl: fileUrl
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Failed to upload model.' });
  }
});

// ----------------------------------------------------------------
// 4. GET MODELS
// ----------------------------------------------------------------
app.get('/models', async (req, res) => {
  try {
    const models = await Model.find();
    res.json(models);
  } catch (err) {
    console.error('Error fetching models:', err);
    res.status(500).json({ message: 'Failed to fetch models.' });
  }
});

// ----------------------------------------------------------------
// 5. SERVE STATIC FILES
// ----------------------------------------------------------------
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ----------------------------------------------------------------
// 6. DATABASE CONNECTION + SERVER START
// ----------------------------------------------------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
