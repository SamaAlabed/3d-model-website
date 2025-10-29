// server.js (No Cloudinary)
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----------------------------------------------------------------
// 1. LOCAL STORAGE CONFIGURATION (Multer)
// ----------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Files will be saved in the "uploads" folder
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
// 2. UPLOAD ROUTE
// ----------------------------------------------------------------
app.post('/api/upload', upload.single('modelFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    // Local file path (for now)
    const fileUrl = `/uploads/${req.file.filename}`;
    console.log(`Model uploaded locally: ${fileUrl}`);

    // TODO: Save the model info to MongoDB if needed
    // const newModel = new Model({ name: req.body.name, url: fileUrl });
    // await newModel.save();

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
// 3. SERVE STATIC FILES
// ----------------------------------------------------------------
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ----------------------------------------------------------------
// 4. DATABASE CONNECTION + SERVER START
// ----------------------------------------------------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
