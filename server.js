// server.js - FIXED VERSION
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------------
// 1. MONGOOSE MODEL
// -------------------------
const modelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  author: { type: String },
  description: { type: String },
  filename: { type: String, required: true }, // Store original filename
  gridfsId: { type: mongoose.Types.ObjectId, required: true } // Store GridFS file ID
}, { timestamps: true });

const ModelGrid = mongoose.model('Model', modelSchema);

// -------------------------
// 2. GRIDFS STORAGE
// -------------------------
const mongoURI = process.env.MONGO_URI;

const storage = new GridFsStorage({
  url: mongoURI,
  options: { useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const fileInfo = {
        filename: `${Date.now()}-${file.originalname}`,
        bucketName: 'models',
        metadata: {
          originalName: file.originalname,
          uploadDate: new Date()
        }
      };
      resolve(fileInfo);
    });
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// -------------------------
// 3. UPLOAD ROUTE - FIXED
// -------------------------
app.post('/api/upload', upload.single('modelFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    // Get the GridFS file ID from the uploaded file
    const gridfsId = req.file.id;

    const newModel = new ModelGrid({
      name: req.body.name,
      author: req.body.author,
      description: req.body.description,
      filename: req.file.filename,
      gridfsId: gridfsId
    });
    
    await newModel.save();

    res.status(200).json({
      message: 'Model uploaded successfully.',
      modelId: newModel._id,
      filename: req.file.filename
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Failed to upload model.' });
  }
});

// -------------------------
// 4. GET MODELS - FIXED
// -------------------------
app.get('/models', async (req, res) => {
  try {
    const models = await ModelGrid.find().sort({ createdAt: -1 });

    const modelsWithUrls = models.map(model => ({
      _id: model._id,
      name: model.name,
      author: model.author,
      description: model.description,
      filePath: `/api/files/${model.filename}`, // Use the correct endpoint
      createdAt: model.createdAt
    }));

    res.json(modelsWithUrls);
  } catch (err) {
    console.error('Error fetching models:', err);
    res.status(500).json({ message: 'Failed to fetch models.' });
  }
});

// -------------------------
// 5. FILE STREAMING ENDPOINT - FIXED
// -------------------------
app.get('/api/files/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    
    // Find the model to get the GridFS ID
    const model = await ModelGrid.findOne({ filename });
    if (!model) {
      return res.status(404).json({ error: 'File not found' });
    }

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { 
      bucketName: 'models' 
    });

    // Find the file in GridFS
    const files = await bucket.find({ filename }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ error: 'File not found in storage' });
    }

    const file = files[0];
    
    // Set appropriate headers
    res.set('Content-Type', file.contentType || 'application/octet-stream');
    res.set('Content-Length', file.length);
    res.set('Content-Disposition', `inline; filename="${file.metadata?.originalName || filename}"`);

    // Stream the file
    const downloadStream = bucket.openDownloadStream(file._id);
    
    downloadStream.on('error', (error) => {
      console.error('Stream error:', error);
      res.status(500).json({ error: 'Error streaming file' });
    });

    downloadStream.pipe(res);

  } catch (err) {
    console.error('File streaming error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// -------------------------
// 6. HEALTH CHECK
// -------------------------
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// -------------------------
// 7. DATABASE CONNECTION
// -------------------------
mongoose.connect(mongoURI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => {
  console.log('Connected to MongoDB Atlas');

  // Serve frontend
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  app.use(express.static(path.join(__dirname, 'public')));

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});