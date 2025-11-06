// // server.js - UPDATED (ES module)
// import express from 'express';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import multer from 'multer';
// import { GridFsStorage } from 'multer-gridfs-storage';
// import { fileURLToPath } from 'url';
// import path from 'path';
// import { WebSocketServer } from 'ws';

// dotenv.config();
// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // -------------------------
// // 1. MONGOOSE MODEL
// // -------------------------
// const modelSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   author: { type: String },
//   description: { type: String },
//   filename: { type: String, required: true }, // Store original filename
//   gridfsId: { type: mongoose.Types.ObjectId, required: true } // Store GridFS file ID
// }, { timestamps: true });

// const ModelGrid = mongoose.model('Model', modelSchema);

// // -------------------------
// // 2. GRIDFS STORAGE
// // -------------------------
// const mongoURI = process.env.MONGO_URI;

// const storage = new GridFsStorage({
//   url: mongoURI,
//   options: { useUnifiedTopology: true },
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       const fileInfo = {
//         filename: `${Date.now()}-${file.originalname}`,
//         bucketName: 'models',
//         metadata: {
//           originalName: file.originalname,
//           uploadDate: new Date()
//         }
//       };
//       resolve(fileInfo);
//     });
//   }
// });

// const upload = multer({ 
//   storage,
//   limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
// });

// // -------------------------
// // 3. UPLOAD ROUTE - FIXED
// // -------------------------
// app.post('/api/upload', upload.single('modelFile'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded.' });
//     }

//     // Get the GridFS file ID from the uploaded file
//     const gridfsId = req.file.id;

//     const newModel = new ModelGrid({
//       name: req.body.name,
//       author: req.body.author,
//       description: req.body.description,
//       filename: req.file.filename,
//       gridfsId: gridfsId
//     });
    
//     await newModel.save();

//     res.status(200).json({
//       message: 'Model uploaded successfully.',
//       modelId: newModel._id,
//       filename: req.file.filename
//     });
//   } catch (err) {
//     console.error('Upload error:', err);
//     res.status(500).json({ message: 'Failed to upload model.' });
//   }
// });

// // -------------------------
// // 4. GET MODELS - FIXED
// // -------------------------
// app.get('/models', async (req, res) => {
//   try {
//     const models = await ModelGrid.find().sort({ createdAt: -1 });

//     const modelsWithUrls = models.map(model => ({
//       _id: model._id,
//       name: model.name,
//       author: model.author,
//       description: model.description,
//       filePath: `/api/files/${model.filename}`, // Use the correct endpoint
//       createdAt: model.createdAt
//     }));

//     res.json(modelsWithUrls);
//   } catch (err) {
//     console.error('Error fetching models:', err);
//     res.status(500).json({ message: 'Failed to fetch models.' });
//   }
// });

// // -------------------------
// // 5. FILE STREAMING ENDPOINT - FIXED
// // -------------------------
// app.get('/api/files/:filename', async (req, res) => {
//   try {
//     const filename = req.params.filename;
    
//     // Find the model to get the GridFS ID
//     const model = await ModelGrid.findOne({ filename });
//     if (!model) {
//       return res.status(404).json({ error: 'File not found' });
//     }

//     const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { 
//       bucketName: 'models' 
//     });

//     // Find the file in GridFS
//     const files = await bucket.find({ filename }).toArray();
//     if (!files || files.length === 0) {
//       return res.status(404).json({ error: 'File not found in storage' });
//     }

//     const file = files[0];
    
//     // Set appropriate headers
//     res.set('Content-Type', file.contentType || 'application/octet-stream');
//     res.set('Content-Length', file.length);
//     res.set('Content-Disposition', `inline; filename="${file.metadata?.originalName || filename}"`);

//     // Stream the file
//     const downloadStream = bucket.openDownloadStream(file._id);
    
//     downloadStream.on('error', (error) => {
//       console.error('Stream error:', error);
//       res.status(500).json({ error: 'Error streaming file' });
//     });

//     downloadStream.pipe(res);

//   } catch (err) {
//     console.error('File streaming error:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // -------------------------
// // 6. HEALTH CHECK
// // -------------------------
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'OK', timestamp: new Date().toISOString() });
// });

// // -------------------------
// // 7. WEBSOCKET: init function + route to notify Unity
// // -------------------------
// let wss; // will hold WebSocketServer instance

// function initWebSocket(server) {
//   wss = new WebSocketServer({ server });
//   console.log('✅ WebSocket server initialized');

//   // wss.on('connection', (ws, req) => {
//   //   console.log('🔗 Unity (or other client) connected via WebSocket');

//   //   ws.on('message', (message) => {
//   //     // log raw messages from clients (Unity) if any
//   //     try {
//   //       console.log('📩 WS message from client:', message.toString());
//   //     } catch (e) {
//   //       console.log('📩 WS message (non-text) received');
//   //     }
//   //   });

//   //   ws.on('close', () => {
//   //     console.log('❌ WebSocket client disconnected');
//   //   });

//   //   ws.on('error', (err) => {
//   //     console.error('⚠️ WebSocket error:', err);
//   //   });
//   // });
//   wss.on('connection', (ws) => {
//   console.log("🔗 Unity connected via WebSocket");

//   ws.on('message', async (message) => {
//     try {
//       const data = JSON.parse(message.toString());
//       console.log("📩 WS Request:", data);

//       // ✅ Request model list
//       if (data.command === "get_model_list") {
//         const models = await ModelGrid.find({}).sort({ createdAt: -1 });

//         ws.send(JSON.stringify({
//           type: "model_list",
//           models: models.map(m => m.filename)
//         }));
//         console.log("📤 Sent model list to Unity");
//       }

//       // ✅ Request model file
//       if (data.command === "get_model" && data.modelName) {
//         const model = await ModelGrid.findOne({ filename: data.modelName });
//         if (!model) return ws.send(JSON.stringify({ type: "error", message: "Model not found" }));

//         const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'models' });

//         const chunks = [];
//         const downloadStream = bucket.openDownloadStream(model.gridfsId);

//         downloadStream.on("data", (chunk) => chunks.push(chunk));
//         downloadStream.on("error", (err) => ws.send(JSON.stringify({ type: "error", message: err.message })));
//         downloadStream.on("end", () => {
//           const buffer = Buffer.concat(chunks);
//           ws.send(JSON.stringify({
//             type: "model_data",
//             filename: model.filename,
//             data: buffer.toString("base64")
//           }));
//           console.log(`📤 Sent model ${model.filename} to Unity`);
//         });
//       }
//     } catch (err) {
//       console.error("❌ Error in WebSocket message:", err);
//     }
//   });
// });

// }

// // API endpoint that frontend calls to notify Unity to load a model
// app.post('/api/select-model', async (req, res) => {
//   try {
//     const { modelUrl } = req.body;

//     if (!modelUrl) return res.status(400).json({ error: 'Missing modelUrl' });

//     // Broadcast to all connected ws clients
//     if (wss) {
//       wss.clients.forEach(client => {
//         if (client.readyState === 1) {
//           client.send(JSON.stringify({ action: 'loadModel', modelUrl }));
//         }
//       });
//     }

//     res.json({ message: 'Model URL broadcasted to WebSocket clients' });
//   } catch (err) {
//     console.error('Error in /api/select-model:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // -------------------------
// // 8. DATABASE CONNECTION & SERVER START
// // -------------------------
// mongoose.connect(mongoURI, { 
//   useNewUrlParser: true, 
//   useUnifiedTopology: true 
// })
// .then(() => {
//   console.log('Connected to MongoDB Atlas');

//   // Serve frontend
//   const __filename = fileURLToPath(import.meta.url);
//   const __dirname = path.dirname(__filename);
//   app.use(express.static(path.join(__dirname, 'public')));

//   app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
//   });

//   const PORT = process.env.PORT || 5000;
//   const server = app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//     console.log(`Health check: http://localhost:${PORT}/api/health`);
//   });

//   // Initialize WebSocket server bound to the same http server
//   initWebSocket(server);

// })
// .catch(err => {
//   console.error('MongoDB connection error:', err);
//   process.exit(1);
// });


// server.js - UPDATED (ES module)
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import { fileURLToPath } from 'url';
import path from 'path';
import { WebSocketServer } from 'ws';

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
// 7. WEBSOCKET: init function + route to notify Unity
// -------------------------
let wss; // will hold WebSocketServer instance

function initWebSocket(server) {
  wss = new WebSocketServer({ server });
  console.log('✅ WebSocket server initialized');

  wss.on('connection', (ws) => {
  console.log("🔗 Unity connected via WebSocket");

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log("📩 WS Request:", data);

// 🚨 START EDITS FOR MODEL LISTING 🚨

      // ✅ Request model list (Updated to send ID, name, and filename)
      if (data.command === "get_model_list") {
        const models = await ModelGrid.find({}, 'name filename _id').sort({ createdAt: -1 });

        ws.send(JSON.stringify({
          type: "model_list", // Using 'type' for a clear response structure
          models: models.map(m => ({ 
                id: m._id.toString(), 
                name: m.name, 
                filename: m.filename 
            })) // Send richer data
        }));
        console.log("📤 Sent rich model list to Unity");
      }

// 🚨 END EDITS FOR MODEL LISTING 🚨

      // ✅ Request model file (Kept this as-is, though the new Unity approach uses HTTP stream)
      if (data.command === "get_model" && data.modelName) {
        const model = await ModelGrid.findOne({ filename: data.modelName });
        if (!model) return ws.send(JSON.stringify({ type: "error", message: "Model not found" }));

        const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'models' });

        const chunks = [];
        const downloadStream = bucket.openDownloadStream(model.gridfsId);

        downloadStream.on("data", (chunk) => chunks.push(chunk));
        downloadStream.on("error", (err) => ws.send(JSON.stringify({ type: "error", message: err.message })));
        downloadStream.on("end", () => {
          const buffer = Buffer.concat(chunks);
          ws.send(JSON.stringify({
            type: "model_data",
            filename: model.filename,
            data: buffer.toString("base64")
          }));
          console.log(`📤 Sent model ${model.filename} to Unity`);
        });
      }
    } catch (err) {
      console.error("❌ Error in WebSocket message:", err);
    }
  });
});

}

// API endpoint that frontend calls to notify Unity to load a model
app.post('/api/select-model', async (req, res) => {
  try {
    const { modelUrl } = req.body;

    if (!modelUrl) return res.status(400).json({ error: 'Missing modelUrl' });

    // Broadcast to all connected ws clients
    if (wss) {
      wss.clients.forEach(client => {
        if (client.readyState === 1) {
          client.send(JSON.stringify({ action: 'loadModel', modelUrl }));
        }
      });
    }

    res.json({ message: 'Model URL broadcasted to WebSocket clients' });
  } catch (err) {
    console.error('Error in /api/select-model:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// -------------------------
// 8. DATABASE CONNECTION & SERVER START
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
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });

  // Initialize WebSocket server bound to the same http server
  initWebSocket(server);

})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});