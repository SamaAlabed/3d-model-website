// // // Function to fetch and display models
// // async function loadModels() {
// //   try {
// //     const response = await fetch('http://localhost:5000/models');
// //     if (!response.ok) {
// //       throw new Error(`HTTP error! Status: ${response.status}`);
// //     }
// //     const models = await response.json();
    
// //     const container = document.getElementById('modelsContainer');
// //     container.innerHTML = '';
    
// //     if (models.length === 0) {
// //       container.innerHTML = '<p>No models uploaded yet. <a href="upload.html">Upload one here</a>.</p>';
// //       return;
// //     }
    
// //   models.forEach(model => {
// //   const modelCard = document.createElement('div');
// //   modelCard.className = 'model-card';
// //   modelCard.innerHTML = `
// //     <h3>${model.name}</h3>
// //     <p><strong>Author:</strong> ${model.author}</p>
// //     <p>${model.description}</p>
// //     <button class="btn" onclick="viewModel('${model.filePath}')">View in VR</button>
// //     <button class="btn" onclick="downloadModel('${model.filePath}', '${model.name}')">Download Model</button>
// //   `;
// //   container.appendChild(modelCard);
// // });

// //   } catch (error) {
// //     console.error('Error loading models:', error);
// //     document.getElementById('modelsContainer').innerHTML = '<p>Error loading models. </p>';
// //   }
// // }

// // // Inline Web Viewer Function
// // function viewInWeb(filePath) {
// //   const viewer = document.getElementById('inlineViewer');
// //   const canvas = document.getElementById('threejsCanvas');
// //   viewer.classList.add('active');

// //   // Clear previous canvas
// //   canvas.innerHTML = '';

// //   // Set up Three.js scene (similar to viewer.html but inline)
// //   const scene = new THREE.Scene();
// //   scene.background = new THREE.Color(0x111111);

// //   const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
// //   camera.position.set(0, 1.6, 3);

// //   const renderer = new THREE.WebGLRenderer({ antialias: true });
// //   renderer.setSize(canvas.clientWidth, canvas.clientHeight);
// //   canvas.appendChild(renderer.domElement);

// //   const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
// //   scene.add(ambientLight);
// //   const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// //   directionalLight.position.set(1, 1, 1);
// //   scene.add(directionalLight);

// //   const controls = new THREE.OrbitControls(camera, renderer.domElement);
// //   controls.enableDamping = true;
// //   controls.dampingFactor = 0.05;

// //   const loader = new THREE.GLTFLoader();
// //   loader.load(
// //     filePath,
// //     (gltf) => {
// //       const model = gltf.scene;
// //       scene.add(model);

// //       // Center and scale
// //       const box = new THREE.Box3().setFromObject(model);
// //       const center = box.getCenter(new THREE.Vector3());
// //       model.position.sub(center);
// //       const size = box.getSize(new THREE.Vector3());
// //       const maxDim = Math.max(size.x, size.y, size.z);
// //       const scale = 2 / maxDim;
// //       model.scale.set(scale, scale, scale);
// //     },
// //     undefined,
// //     (error) => {
// //       console.error('Error loading model:', error);
// //     }
// //   );

// //   function animate() {
// //     requestAnimationFrame(animate);
// //     controls.update();
// //     renderer.render(scene, camera);
// //   }
// //   animate();

// //   // Handle resize
// //   window.addEventListener('resize', () => {
// //     camera.aspect = canvas.clientWidth / canvas.clientHeight;
// //     camera.updateProjectionMatrix();
// //     renderer.setSize(canvas.clientWidth, canvas.clientHeight);
// //   });
// // }

// // // VR Viewing (redirects to viewer.html)
// // function viewModel(filePath) {
// //   window.location.href = `viewer.html?model=${encodeURIComponent(filePath)}`;
// // }

// // function downloadModel(filePath, fileName) {
// //   const link = document.createElement('a');
// //   link.href = filePath; // Path to the uploaded model
// //   link.download = fileName + filePath.substring(filePath.lastIndexOf('.')); // Keep original extension
// //   document.body.appendChild(link);
// //   link.click();
// //   document.body.removeChild(link);
// // }


// // // Close Inline Viewer
// // document.getElementById('closeViewer').addEventListener('click', () => {
// //   document.getElementById('inlineViewer').classList.remove('active');
// // });

// // // Load models on page load
// // window.onload = loadModels;

// // Function to fetch and display models
// // Function to fetch and display models
// // Function to fetch and display models
// async function loadModels() {
//   try {
//     // ✅ Use the correct Render endpoint
//     const response = await fetch('https://threed-model-website.onrender.com/models');
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//     const models = await response.json();

//     const container = document.getElementById('modelsContainer');
//     container.innerHTML = '';

//     if (models.length === 0) {
//       container.innerHTML = '<p>No models uploaded yet. <a href="upload.html">Upload one here</a>.</p>';
//       return;
//     }

//     models.forEach(model => {
//       const fullPath = 'https://threed-model-website.onrender.com' + model.url; // prepend backend URL if model.url is relative

//       const modelCard = document.createElement('div');
//       modelCard.className = 'model-card';
//       modelCard.innerHTML = `
//         <h3>${model.name}</h3>
//         <p><strong>Author:</strong> ${model.author || "Unknown"}</p>
//         <p>${model.description || "No description available."}</p>

//         <!-- Actions container -->
//         <div class="card-actions">
//           <button class="btn" onclick="viewModel('${fullPath}')">View in VR</button>
//           <select id="appSelect-${model._id}" class="app-select">
//             <option value="">Select App (Optional)</option>
//             <option value="blender">Blender</option>
//             <option value="unity">Unity</option>
//             <option value="unreal">Unreal Engine</option>
//           </select>
//           <button class="btn" onclick="downloadModel('${fullPath}', '${model.name}', '${model._id}')">Download Model</button>
//         </div>
//       `;
//       container.appendChild(modelCard);
//     });

//   } catch (error) {
//     console.error('Error loading models:', error);
//     document.getElementById('modelsContainer').innerHTML = '<p>Error loading models. </p>';
//   }
// }

// // VR Viewing (redirects to viewer.html)
// function viewModel(filePath) {
//   window.location.href = `viewer.html?model=${encodeURIComponent(filePath)}`;
// }

// // Download Model
// function downloadModel(filePath, fileName, modelId) {
//   const appSelect = document.getElementById(`appSelect-${modelId}`);
//   const selectedApp = appSelect ? appSelect.value : '';

//   const extension = filePath.substring(filePath.lastIndexOf('.'));

//   let customFileName = fileName;
//   if (selectedApp) {
//     customFileName += `_${selectedApp.charAt(0).toUpperCase() + selectedApp.slice(1)}`;
//   }
//   customFileName += extension;

//   // Use deployed backend path for downloads if needed
//   const link = document.createElement('a');
//   link.href = filePath;
//   link.download = customFileName;
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);

//   if (selectedApp) {
//     const instructions = {
//       blender: "Downloaded! Open in Blender by double-clicking the file or using File > Import > glTF/FBX.",
//       unity: "Downloaded! Import into Unity via Assets > Import New Asset or drag into the project.",
//       unreal: "Downloaded! Import into Unreal Engine via Content Browser > Import."
//     };
//     alert(instructions[selectedApp] || "Downloaded! Open manually in your chosen app.");
//   } else {
//     alert("Downloaded! Open manually in your preferred 3D app (e.g., Blender, Unity).");
//   }
// }

// // Inline Web Viewer (if you still want this)
// function viewInWeb(filePath) {
//   const viewer = document.getElementById('inlineViewer');
//   const canvas = document.getElementById('threejsCanvas');
//   viewer.classList.add('active');

//   canvas.innerHTML = '';

//   const scene = new THREE.Scene();
//   scene.background = new THREE.Color(0x111111);

//   const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
//   camera.position.set(0, 1.6, 3);

//   const renderer = new THREE.WebGLRenderer({ antialias: true });
//   renderer.setSize(canvas.clientWidth, canvas.clientHeight);
//   canvas.appendChild(renderer.domElement);

//   const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
//   scene.add(ambientLight);
//   const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
//   directionalLight.position.set(1, 1, 1);
//   scene.add(directionalLight);

//   const controls = new THREE.OrbitControls(camera, renderer.domElement);
//   controls.enableDamping = true;
//   controls.dampingFactor = 0.05;

//   const loader = new THREE.GLTFLoader();
//   loader.load(
//     filePath,
//     (gltf) => {
//       const model = gltf.scene;
//       scene.add(model);

//       const box = new THREE.Box3().setFromObject(model);
//       const center = box.getCenter(new THREE.Vector3());
//       model.position.sub(center);
//       const size = box.getSize(new THREE.Vector3());
//       const maxDim = Math.max(size.x, size.y, size.z);
//       const scale = 2 / maxDim;
//       model.scale.set(scale, scale, scale);
//     },
//     undefined,
//     (error) => console.error('Error loading model:', error)
//   );

//   function animate() {
//     requestAnimationFrame(animate);
//     controls.update();
//     renderer.render(scene, camera);
//   }
//   animate();

//   window.addEventListener('resize', () => {
//     camera.aspect = canvas.clientWidth / canvas.clientHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(canvas.clientWidth, canvas.clientHeight);
//   });
// }

// // Close Inline Viewer
// document.getElementById('closeViewer')?.addEventListener('click', () => {
//   document.getElementById('inlineViewer')?.classList.remove('active');
// });

// // Load models on page load
// window.onload = loadModels;




// // Function to fetch and display models
// async function loadModels() {
//   try {
//     // ✅ Use the correct Render endpoint
//     const response = await fetch('https://threed-model-website.onrender.com/models');
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//     const models = await response.json();

//     const container = document.getElementById('modelsContainer');
//     container.innerHTML = '';

//     if (models.length === 0) {
//       container.innerHTML = '<p>No models uploaded yet. <a href="upload.html">Upload one here</a>.</p>';
//       return;
//     }

//     models.forEach(model => {
//       // ✅ Fix: Use model.filePath (from backend schema) instead of model.url
//       const fullPath = 'https://threed-model-website.onrender.com' + model.filePath; // model.filePath is "/uploads/filename"

//       const modelCard = document.createElement('div');
//       modelCard.className = 'model-card';
//       modelCard.innerHTML = `
//         <h3>${model.name}</h3>
//         <p><strong>Author:</strong> ${model.author || "Unknown"}</p>
//         <p>${model.description || "No description available."}</p>

//         <!-- Actions container -->
//         <div class="card-actions">
//           <button class="btn" onclick="viewModel('${fullPath}')">View in VR</button>
//           <select id="appSelect-${model._id}" class="app-select">
//             <option value="">Select App (Optional)</option>
//             <option value="blender">Blender</option>
//             <option value="unity">Unity</option>
//             <option value="unreal">Unreal Engine</option>
//           </select>
//           <button class="btn" onclick="downloadModel('${fullPath}', '${model.name}', '${model._id}')">Download Model</button>
//         </div>
//       `;
//       container.appendChild(modelCard);
//     });

//   } catch (error) {
//     console.error('Error loading models:', error);
//     document.getElementById('modelsContainer').innerHTML = '<p>Error loading models. </p>';
//   }
// }

// // VR Viewing (redirects to viewer.html)
// function viewModel(filePath) {
//   window.location.href = `viewer.html?model=${encodeURIComponent(filePath)}`;
// }

// // Download Model
// function downloadModel(filePath, fileName, modelId) {
//   const appSelect = document.getElementById(`appSelect-${modelId}`);
//   const selectedApp = appSelect ? appSelect.value : '';

//   const extension = filePath.substring(filePath.lastIndexOf('.'));

//   let customFileName = fileName;
//   if (selectedApp) {
//     customFileName += `_${selectedApp.charAt(0).toUpperCase() + selectedApp.slice(1)}`;
//   }
//   customFileName += extension;

//   // Use deployed backend path for downloads if needed
//   const link = document.createElement('a');
//   link.href = filePath;
//   link.download = customFileName;
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);

//   if (selectedApp) {
//     const instructions = {
//       blender: "Downloaded! Open in Blender by double-clicking the file or using File > Import > glTF/FBX.",
//       unity: "Downloaded! Import into Unity via Assets > Import New Asset or drag into the project.",
//       unreal: "Downloaded! Import into Unreal Engine via Content Browser > Import."
//     };
//     alert(instructions[selectedApp] || "Downloaded! Open manually in your chosen app.");
//   } else {
//     alert("Downloaded! Open manually in your preferred 3D app (e.g., Blender, Unity).");
//   }
// }

// // Inline Web Viewer (if you still want this)
// function viewInWeb(filePath) {
//   const viewer = document.getElementById('inlineViewer');
//   const canvas = document.getElementById('threejsCanvas');
//   viewer.classList.add('active');

//   canvas.innerHTML = '';

//   const scene = new THREE.Scene();
//   scene.background = new THREE.Color(0x111111);

//   const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
//   camera.position.set(0, 1.6, 3);

//   const renderer = new THREE.WebGLRenderer({ antialias: true });
//   renderer.setSize(canvas.clientWidth, canvas.clientHeight);
//   canvas.appendChild(renderer.domElement);

//   const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
//   scene.add(ambientLight);
//   const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
//   directionalLight.position.set(1, 1, 1);
//   scene.add(directionalLight);

//   const controls = new THREE.OrbitControls(camera, renderer.domElement);
//   controls.enableDamping = true;
//   controls.dampingFactor = 0.05;

//   const loader = new THREE.GLTFLoader();
//   loader.load(
//     filePath,
//     (gltf) => {
//       const model = gltf.scene;
//       scene.add(model);

//       const box = new THREE.Box3().setFromObject(model);
//       const center = box.getCenter(new THREE.Vector3());
//       model.position.sub(center);
//       const size = box.getSize(new THREE.Vector3());
//       const maxDim = Math.max(size.x, size.y, size.z);
//       const scale = 2 / maxDim;
//       model.scale.set(scale, scale, scale);
//     },
//     undefined,
//     (error) => console.error('Error loading model:', error)
//   );

//   function animate() {
//     requestAnimationFrame(animate);
//     controls.update();
//     renderer.render(scene, camera);
//   }
//   animate();

//   window.addEventListener('resize', () => {
//     camera.aspect = canvas.clientWidth / canvas.clientHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(canvas.clientWidth, canvas.clientHeight);
//   });
// }

// // Close Inline Viewer
// document.getElementById('closeViewer')?.addEventListener('click', () => {
//   document.getElementById('inlineViewer')?.classList.remove('active');
// });

// // Load models on page load
// window.onload = loadModels;


// script.js - COMPLETELY REPLACED
async function loadModels() {
  try {
    const response = await fetch('https://threed-model-website.onrender.com/models');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const models = await response.json();

    const container = document.getElementById('modelsContainer');
    container.innerHTML = '';

    if (models.length === 0) {
      container.innerHTML = '<p>No models uploaded yet. <a href="upload.html">Upload one here</a>.</p>';
      return;
    }

    models.forEach(model => {
      const fullPath = 'https://threed-model-website.onrender.com' + model.filePath;

      const modelCard = document.createElement('div');
      modelCard.className = 'model-card';
      modelCard.innerHTML = `
        <h3>${model.name}</h3>
        <p><strong>Author:</strong> ${model.author || "Unknown"}</p>
        <p>${model.description || "No description available."}</p>

        <!-- NEW UNITY BUTTONS -->
        <div class="card-actions">
          <button class="btn" onclick="viewModel('${fullPath}')">View in VR</button>
          <button class="btn unity-btn" onclick="downloadForUnity('${model._id}')">🎮 Download for Unity</button>
          <button class="btn instructions-btn" onclick="showUnityInstructions('${model._id}')">ℹ️ Unity Guide</button>
        </div>
        <div id="unity-instructions-${model._id}" class="unity-instructions" style="display: none;"></div>
      `;
      container.appendChild(modelCard);
    });

  } catch (error) {
    console.error('Error loading models:', error);
    document.getElementById('modelsContainer').innerHTML = '<p>Error loading models. </p>';
  }
}

// NEW: Unity-specific download function
async function downloadForUnity(modelId) {
  try {
    const button = event.target;
    const originalText = button.textContent;
    
    // Show loading state
    button.textContent = '🔄 Preparing...';
    button.disabled = true;
    
    // Get Unity-specific model info
    const infoResponse = await fetch(`https://threed-model-website.onrender.com/api/models/${modelId}/unity-info`);
    const modelInfo = await infoResponse.json();
    
    // Trigger download
    const downloadLink = document.createElement('a');
    downloadLink.href = modelInfo.downloadUrl;
    downloadLink.download = modelInfo.filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // Show instructions after download
    showUnityInstructions(modelId);
    
    // Reset button after 2 seconds
    setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
    }, 2000);
    
  } catch (error) {
    console.error('Unity download failed:', error);
    alert('Download failed. Please try again.');
    event.target.textContent = '🎮 Download for Unity';
    event.target.disabled = false;
  }
}

// NEW: Show Unity import instructions
async function showUnityInstructions(modelId) {
  const instructionsDiv = document.getElementById(`unity-instructions-${modelId}`);
  
  try {
    const infoResponse = await fetch(`https://threed-model-website.onrender.com/api/models/${modelId}/unity-info`);
    const modelInfo = await infoResponse.json();
    
    instructionsDiv.innerHTML = `
      <div class="unity-guide">
        <h4>🎮 How to Import into Unity</h4>
        <div class="step">
          <strong>Step 1:</strong> Download the ${modelInfo.unityInfo.icon} ${modelInfo.unityInfo.type} file above
        </div>
        <div class="step">
          <strong>Step 2:</strong> Open your Unity project
        </div>
        <div class="step">
          <strong>Step 3:</strong> ${modelInfo.unityInfo.instructions}
        </div>
        <div class="step">
          <strong>Step 4:</strong> The model will appear in your Project window
        </div>
        <div class="tips">
          <strong>💡 Unity Tips:</strong>
          <ul>
            ${modelInfo.unityInfo.tips ? modelInfo.unityInfo.tips.map(tip => `<li>${tip}</li>`).join('') : ''}
            <li>Make sure you have Unity 2019.3+ for best GLB support</li>
            <li>For complex models, check the import settings in Inspector</li>
            <li>FBX files may need material reassignment</li>
          </ul>
        </div>
        <div class="unity-links">
          <a href="https://docs.unity3d.com/Manual/ImportingModelFiles.html" target="_blank">📚 Unity Import Guide</a>
          <a href="https://unity.com/download" target="_blank">⬇️ Download Unity</a>
        </div>
      </div>
    `;
    instructionsDiv.style.display = 'block';
    
    // Scroll to instructions
    instructionsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
  } catch (error) {
    console.error('Error loading Unity instructions:', error);
    instructionsDiv.innerHTML = '<p>Error loading Unity instructions. Please try again.</p>';
    instructionsDiv.style.display = 'block';
  }
}

// Keep your existing functions
function viewModel(filePath) {
  window.location.href = `viewer.html?model=${encodeURIComponent(filePath)}`;
}

function downloadModel(filePath, fileName, modelId) {
  const extension = filePath.substring(filePath.lastIndexOf('.'));
  const link = document.createElement('a');
  link.href = filePath;
  link.download = fileName + extension;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  alert("Downloaded! Open in your preferred 3D application.");
}

// Load models on page load
window.onload = loadModels;