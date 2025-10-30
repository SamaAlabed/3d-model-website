// // server.js
// import express from 'express';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import multer from 'multer';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { GridFsStorage } from 'multer-gridfs-storage';
// import Model from './models/Model3D.js';

// // Load environment variables
// dotenv.config();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // ----------------------------------------------------------------
// // 1. GRIDFS STORAGE CONFIGURATION (Multer + GridFS)
// // ----------------------------------------------------------------
// const mongoURI = process.env.MONGO_URI;

// const storage = new GridFsStorage({
//   url: mongoURI,
//   options: { useUnifiedTopology: true },
//   file: (req, file) => ({
//     filename: `${Date.now()}-${file.originalname}`,
//     bucketName: 'models' // Must match bucket name below
//   })
// });

// const upload = multer({ storage });

// // ----------------------------------------------------------------
// // 2. UPLOAD ROUTE
// // ----------------------------------------------------------------
// app.post('/api/upload', upload.single('modelFile'), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });

//     const fileUrl = `/models/${req.file.filename}`; // Matches the streaming route

//     // Save metadata to MongoDB
//     const newModel = new Model({
//       name: req.body.name,
//       author: req.body.author,
//       description: req.body.description,
//       filePath: req.file.filename // store GridFS filename
//     });
//     await newModel.save();

//     res.status(200).json({ message: 'Model uploaded successfully.', modelUrl: fileUrl });
//   } catch (error) {
//     console.error('Upload error:', error);
//     res.status(500).json({ message: 'Failed to upload model.' });
//   }
// });

// // ----------------------------------------------------------------
// // 3. GET MODELS
// // ----------------------------------------------------------------
// app.get('/models', async (req, res) => {
//   try {
//     const models = await Model.find();
//     res.json(models);
//   } catch (err) {
//     console.error('Error fetching models:', err);
//     res.status(500).json({ message: 'Failed to fetch models.' });
//   }
// });

// // ----------------------------------------------------------------
// // 4. DATABASE CONNECTION + SERVE FILES
// // ----------------------------------------------------------------
// mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     const conn = mongoose.connection;
//     const bucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'models' });

//     // Route to stream files from GridFS
//     app.get('/models/:filename', (req, res) => {
//       const filename = req.params.filename;
//       bucket.find({ filename }).toArray((err, files) => {
//         if (!files || files.length === 0) return res.status(404).json({ error: 'File not found' });
//         bucket.openDownloadStreamByName(filename).pipe(res);
//       });
//     });

//     // Serve static files (front-end)
//     const __filename = fileURLToPath(import.meta.url);
//     const __dirname = path.dirname(__filename);
//     app.use(express.static(path.join(__dirname, 'public')));

//     app.get('/', (req, res) => {
//       res.sendFile(path.join(__dirname, 'public', 'index.html'));
//     });

//     // Start server
//     const PORT = process.env.PORT || 5000;
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//     console.log('Connected to MongoDB Atlas');
//   })
//   .catch(err => console.error('MongoDB connection error:', err));


/// server.js
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
  filePath: { type: String, required: true } // store GridFS filename
}, { timestamps: true });

const ModelGrid = mongoose.model('Model', modelSchema);

// -------------------------
// 2. GRIDFS STORAGE
// -------------------------
const mongoURI = process.env.MONGO_URI;

const storage = new GridFsStorage({
  url: mongoURI,
  options: { useUnifiedTopology: true },
  file: (req, file) => ({
    filename: `${Date.now()}-${file.originalname}`,
    bucketName: 'models'
  })
});

const upload = multer({ storage });

// -------------------------
// 3. UNITY HELPER FUNCTIONS
// -------------------------
function getUnityImportInfo(filename) {
  const ext = path.extname(filename).toLowerCase();
  const unityInfo = {
    '.fbx': { 
      type: 'FBX', 
      instructions: 'Drag into Assets folder or use Assets → Import New Asset',
      icon: '📦',
      tips: ['Materials may need reconfiguration', 'Supports animations and rigging']
    },
    '.glb': { 
      type: 'GLB', 
      instructions: 'Drag into Assets folder. Unity 2019.3+ has built-in GLTF importer',
      icon: '🟦',
      tips: ['Best for web-to-Unity workflow', 'Includes materials and textures']
    },
    '.gltf': { 
      type: 'GLTF', 
      instructions: 'Include accompanying .bin and texture files',
      icon: '🟦',
      tips: ['Keep all related files together', 'May require additional setup']
    },
    '.obj': { 
      type: 'OBJ', 
      instructions: 'Drag into Assets folder. May require materials setup',
      icon: '📐',
      tips: ['Simple geometry format', 'Materials need manual assignment']
    }
  };
  return unityInfo[ext] || { 
    type: '3D Model', 
    instructions: 'Drag into Unity Assets folder', 
    icon: '📁',
    tips: ['Check Unity documentation for format support']
  };
}

// -------------------------
// 4. UPLOAD ROUTE
// -------------------------
app.post('/api/upload', upload.single('modelFile'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });

    const newModel = new ModelGrid({
      name: req.body.name,
      author: req.body.author,
      description: req.body.description,
      filePath: req.file.filename
    });
    await newModel.save();

    // Return full URL for immediate access
    const fileUrl = `${req.protocol}://${req.get('host')}/models/${req.file.filename}`;
    res.status(200).json({
      message: 'Model uploaded successfully.',
      modelId: newModel._id,
      modelUrl: fileUrl
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Failed to upload model.' });
  }
});

// -------------------------
// 5. GET MODELS
// -------------------------
app.get('/models', async (req, res) => {
  try {
    const models = await ModelGrid.find().sort({ createdAt: -1 });

    const modelsWithUrls = models.map(model => ({
      _id: model._id,
      name: model.name,
      author: model.author,
      description: model.description,
      filePath: `/models/${model.filePath}`, // Fixed: Use filePath instead of url
      createdAt: model.createdAt
    }));

    res.json(modelsWithUrls);
  } catch (err) {
    console.error('Error fetching models:', err);
    res.status(500).json({ message: 'Failed to fetch models.' });
  }
});

// -------------------------
// 6. UNITY-SPECIFIC ENDPOINTS
// -------------------------
app.get('/api/models/:id/unity-info', async (req, res) => {
  try {
    const model = await ModelGrid.findById(req.params.id);
    if (!model) return res.status(404).json({ message: 'Model not found' });
    
    const unityInfo = getUnityImportInfo(model.filePath);
    
    res.json({
      modelId: model._id,
      name: model.name,
      filename: model.filePath,
      downloadUrl: `${req.protocol}://${req.get('host')}/models/${model.filePath}`,
      unityInfo: unityInfo,
      uploadDate: model.createdAt
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching model info' });
  }
});

// Enhanced download endpoint with Unity context
app.get('/api/download/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const model = await ModelGrid.findOne({ filePath: filename });
    
    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }

    const unityInfo = getUnityImportInfo(filename);
    
    // Set download headers
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('X-Unity-Import-Type', unityInfo.type);
    
    // Stream the file
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { 
      bucketName: 'models' 
    });
    
    bucket.openDownloadStreamByName(filename).pipe(res);
    
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).json({ message: 'Download failed' });
  }
});

// -------------------------
// 7. DATABASE + GRIDFS STREAM
// -------------------------
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    const conn = mongoose.connection;
    const bucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: 'models' });

    // Stream files
    app.get('/models/:filename', (req, res) => {
      const filename = req.params.filename;
      bucket.find({ filename }).toArray((err, files) => {
        if (!files || files.length === 0) return res.status(404).json({ error: 'File not found' });

        res.set('Content-Type', files[0].contentType || 'application/octet-stream');
        bucket.openDownloadStreamByName(filename).pipe(res);
      });
    });

    // Serve frontend
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    app.use(express.static(path.join(__dirname, 'public')));

    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    console.log('Connected to MongoDB Atlas');
  })
  .catch(err => console.error('MongoDB connection error:', err));