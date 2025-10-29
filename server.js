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
