# 3D Model Website

This project is a web application that allows users to **upload, store, and view 3D models** (GLB, GLTF, FBX). It uses:

- **Frontend:** HTML, CSS, JavaScript, Three.js  
- **Backend:** Node.js with Express  
- **Database:** MongoDB  
- **File uploads:** Multer  

---

## Features

1. Upload 3D models with **name, author, and description**.  
2. Browse uploaded 3D models in a gallery.  
3. View 3D models directly in the browser using **Three.js** with **OrbitControls**.  
4. Stores files locally in the `uploads` folder and stores metadata in MongoDB.

---

## Setup Instructions

Follow these steps carefully. You don’t need prior coding experience.  

### 1️⃣ Install Required Software

1. **Node.js**  
   Download and install from [https://nodejs.org](https://nodejs.org)  

2. **MongoDB**  
   - Download and install from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)  
   - Start MongoDB using MongoDB Compass or via terminal:  
     ```bash
     mongod
     ```  
   - The database will run at: `mongodb://localhost:27017`

3. **Visual Studio Code (VS Code)**  
   Download from [https://code.visualstudio.com/](https://code.visualstudio.com/)  

4. **Live Server Extension** in VS Code  
   - Open VS Code → Extensions → Search "Live Server" → Install  

---
=====================================================================================================================================================================

### 2️⃣ Clone or Download the Project

Place the project folder anywhere on your computer, e.g., `D:\3D-Model-Website`.

---
=====================================================================================================================================================================

### 3️⃣ Install Node.js Packages

1. Open VS Code  
2. Open the terminal inside VS Code (`Ctrl + ~`)  
3. Navigate to the project folder:  
   
   cd D:\3D-Model-Website

Install project dependencies:

npm install express mongoose multer cors dotenv
Install nodemon globally (optional, used for automatic server restart):

npm install -g nodemon
Or as a dev dependency:
npm install --save-dev nodemon

Install Three.js (optional if you want to use locally instead of CDN):
npm install three
For this project, Three.js is loaded from a CDN in the browser, so local installation is optional.

=====================================================================================================================================================================

4️⃣ Configure Environment Variables
In the project root, create a file called .env

Add the following line:


MONGO_URI=mongodb://127.0.0.1:27017/threeDmodels
PORT=5000
This tells the backend where your MongoDB database is and which port to run on.

=====================================================================================================================================================================

5️⃣ Run the Backend Server
In VS Code terminal:

npm run dev
You should see messages:

🚀 Server running on port 5000
✅ Connected to MongoDB

=====================================================================================================================================================================

6️⃣ Open the Frontend
Right-click index.html → Open with Live Server

The gallery page should load

If there are no models yet, it will say: "No models uploaded yet."

=====================================================================================================================================================================

7️⃣ Upload a 3D Model
Open upload.html with Live Server

Fill in:

Name

Author

Description

Choose a .glb file

Click Upload

Check your uploads folder and MongoDB — the file and metadata should be saved

=====================================================================================================================================================================

8️⃣ View 3D Models
Go back to index.html in Live Server

The gallery will now display the uploaded model(s)

Click View 3D to open the model in the browser using Three.js

Folder Structure
bash
Copy code
3D-Model-Website/
│
├─ uploads/                # Uploaded 3D model files
├─ models/
│   └─ Model3D.js          # MongoDB schema for 3D models
├─ index.html              # Gallery & 3D viewer page
├─ upload.html             # Upload form page
├─ style.css               # Styling for pages
├─ server.js               # Node.js backend
├─ package.json            # Node.js dependencies & scripts
└─ .env                    # Environment variables
Important Notes
Always run the backend server first (npm run dev) before opening the frontend.

Use Live Server to open HTML pages — opening directly as file:// will break module imports.

If you add new dependencies, run npm install again.

Supported 3D formats: .glb, .gltf, .fbx.

