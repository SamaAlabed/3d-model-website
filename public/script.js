// // script.js - RESPONSIVE FIXED VERSION
// async function loadModels() {
//   try {
//     console.log('Loading models...');
    
//     // Show loading state
//     const container = document.getElementById('modelsContainer');
//     container.innerHTML = '<div class="loading-spinner">Loading models...</div>';
    
//     const response = await fetch('https://threed-model-website.onrender.com/models');
    
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }
    
//     const models = await response.json();
//     console.log('Models loaded:', models);

//     container.innerHTML = '';

//     if (models.length === 0) {
//       container.innerHTML = `
//         <div class="empty-state">
//           <p>No models uploaded yet.</p>
//           <a href="upload.html" class="btn">Upload Your First Model</a>
//         </div>
//       `;
//       return;
//     }

//     models.forEach(model => {
//       // Use the correct filePath from the backend response
//       const fullPath = 'https://threed-model-website.onrender.com' + model.filePath;
//       console.log('Model path:', fullPath);

//       const modelCard = document.createElement('div');
//       modelCard.className = 'model-card';
//       modelCard.innerHTML = `
//         <div class="model-card-content">
//           <h3>${this.escapeHtml(model.name)}</h3>
//           <p><strong>Author:</strong> ${this.escapeHtml(model.author || "Unknown")}</p>
//           <p class="model-description">${this.escapeHtml(model.description || "No description available.")}</p>
//         </div>

//         <!-- Actions container -->
//         <div class="card-actions">
//           <button class="btn view-btn" onclick="viewModel('${this.escapeHtml(fullPath)}')">
//             <span class="btn-text">View in 3D</span>
//           </button>
//           <button class="btn download-btn" onclick="downloadModel('${this.escapeHtml(fullPath)}', '${this.escapeHtml(model.name)}')">
//             <span class="btn-text">Download</span>
//           </button>
//         </div>
//       `;
//       container.appendChild(modelCard);
//     });

//   } catch (error) {
//     console.error('Error loading models:', error);
//     this.showErrorState(error);
//   }
// }

// // Utility function to escape HTML
// function escapeHtml(unsafe) {
//   return unsafe
//     .replace(/&/g, "&amp;")
//     .replace(/</g, "&lt;")
//     .replace(/>/g, "&gt;")
//     .replace(/"/g, "&quot;")
//     .replace(/'/g, "&#039;");
// }

// // Show error state with retry option
// function showErrorState(error) {
//   const container = document.getElementById('modelsContainer');
//   container.innerHTML = `
//     <div class="error-state">
//       <div class="error-icon">⚠️</div>
//       <h3>Unable to Load Models</h3>
//       <p>Please check:</p>
//       <ul>
//         <li>Your internet connection</li>
//         <li>Server availability</li>
//         <li>Console for detailed errors</li>
//       </ul>
//       <p class="error-detail">Error: ${error.message}</p>
//       <button onclick="loadModels()" class="btn retry-btn">
//         <span class="btn-icon">🔄</span>
//         Try Again
//       </button>
//     </div>
//   `;
// }

// // 3D Viewing (redirects to viewer.html)
// function viewModel(filePath) {
//   console.log('Opening model:', filePath);
  
//   // Add loading state for better UX
//   const button = event.target.closest('.btn');
//   if (button) {
//     const originalText = button.innerHTML;
//     button.innerHTML = '<span class="btn-icon">⏳</span> Loading...';
//     button.disabled = true;
    
//     setTimeout(() => {
//       window.location.href = `viewer.html?model=${encodeURIComponent(filePath)}`;
//     }, 500);
//   } else {
//     window.location.href = `viewer.html?model=${encodeURIComponent(filePath)}`;
//   }
// }

// // Download Model
// function downloadModel(filePath, fileName) {
//   try {
//     // Add loading state
//     const button = event.target.closest('.btn');
//     if (button) {
//       const originalText = button.innerHTML;
//       button.innerHTML = '<span class="btn-icon">⏳</span> Downloading...';
//       button.disabled = true;
      
//       setTimeout(() => {
//         button.innerHTML = originalText;
//         button.disabled = false;
//       }, 2000);
//     }
    
//     const extension = filePath.substring(filePath.lastIndexOf('.'));
//     const link = document.createElement('a');
//     link.href = filePath;
//     link.download = fileName + extension;
//     link.target = '_blank';
    
//     // Mobile-friendly download
//     if (this.isMobileDevice()) {
//       // For mobile, open in new tab and show instructions
//       window.open(filePath, '_blank');
//       setTimeout(() => {
//         this.showMobileDownloadInstructions(fileName);
//       }, 1000);
//     } else {
//       // For desktop, trigger download directly
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
    
//     console.log('Download initiated:', filePath);
    
//   } catch (error) {
//     console.error('Download error:', error);
//     this.showToast('Download failed. Please try again.', 'error');
//   }
// }

// // Check if device is mobile
// function isMobileDevice() {
//   return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
//          window.innerWidth <= 768;
// }

// // Show mobile download instructions
// function showMobileDownloadInstructions(fileName) {
//   const instructions = `
//     <div class="mobile-download-modal" id="downloadModal">
//       <div class="modal-content">
//         <button class="close-modal" onclick="this.closeDownloadModal()">×</button>
//         <h3>Download Instructions</h3>
//         <p>To download <strong>${fileName}</strong> on mobile:</p>
//         <ol>
//           <li>Tap and hold the file in the new tab</li>
//           <li>Select "Download" or "Save to Files"</li>
//           <li>Choose your preferred download location</li>
//         </ol>
//         <button class="btn" onclick="this.closeDownloadModal()">Got It</button>
//       </div>
//     </div>
//   `;
  
//   const existingModal = document.getElementById('downloadModal');
//   if (!existingModal) {
//     document.body.insertAdjacentHTML('beforeend', instructions);
//   }
// }

// // Close download modal
// function closeDownloadModal() {
//   const modal = document.getElementById('downloadModal');
//   if (modal) {
//     modal.remove();
//   }
// }

// // Show toast notification
// function showToast(message, type = 'info') {
//   const toast = document.createElement('div');
//   toast.className = `toast toast-${type}`;
//   toast.innerHTML = `
//     <span class="toast-message">${message}</span>
//     <button class="toast-close" onclick="this.remove()">×</button>
//   `;
  
//   document.body.appendChild(toast);
  
//   // Auto-remove after 4 seconds
//   setTimeout(() => {
//     if (toast.parentNode) {
//       toast.remove();
//     }
//   }, 4000);
// }

// // Handle responsive layout changes
// function handleResponsiveLayout() {
//   const container = document.getElementById('modelsContainer');
//   const cards = document.querySelectorAll('.model-card');
  
//   if (window.innerWidth <= 480) {
//     // Mobile small: single column with compact cards
//     cards.forEach(card => {
//       card.classList.add('mobile-compact');
//     });
//   } else if (window.innerWidth <= 768) {
//     // Tablet: two columns
//     cards.forEach(card => {
//       card.classList.remove('mobile-compact');
//     });
//   } else {
//     // Desktop: multi-column
//     cards.forEach(card => {
//       card.classList.remove('mobile-compact');
//     });
//   }
// }

// // Fix upload button positioning for mobile
// function fixUploadButtonPosition() {
//   const uploadButton = document.querySelector('a[href="upload.html"]');
//   const navButton = document.querySelector('.nav-button');
  
//   if (uploadButton && navButton && this.isMobileDevice()) {
//     // Ensure upload button doesn't overlap with title
//     const title = document.querySelector('h1');
//     if (title) {
//       const titleRect = title.getBoundingClientRect();
//       const navRect = navButton.getBoundingClientRect();
      
//       if (navRect.top < titleRect.bottom + 20) {
//         navButton.style.top = `${titleRect.bottom + 30}px`;
//       }
//     }
    
//     // Add mobile-specific class for better styling
//     uploadButton.classList.add('mobile-upload-btn');
//   }
// }

// // Enhanced error handling for Three.js
// window.addEventListener('error', function(e) {
//   console.error('Global error:', e.error);
  
//   // Show user-friendly error message for critical errors
//   if (e.error && e.error.message && e.error.message.includes('Three')) {
//     this.showToast('3D Viewer error. Please try refreshing the page.', 'error');
//   }
// });

// // Load models on page load
// window.onload = function() {
//   loadModels();
//   fixUploadButtonPosition();
  
//   // Handle responsive layout on resize
//   window.addEventListener('resize', () => {
//     handleResponsiveLayout();
//     fixUploadButtonPosition();
//   });
  
//   // Initial layout setup
//   setTimeout(handleResponsiveLayout, 100);
// };

// // Add CSS for responsive elements (you can also put this in your CSS file)
// // // const responsiveStyles = `
// // //   /* Loading states */
// // //   .loading-spinner {
// // //     text-align: center;
// // //     padding: 40px;
// // //     color: #00d4ff;
// // //     font-size: 1.1em;
// // //   }
  
// // //   /* Empty state */
// // //   .empty-state {
// // //     text-align: center;
// // //     padding: 60px 20px;
// // //     background: rgba(255, 255, 255, 0.05);
// // //     border-radius: 12px;
// // //     border: 2px dashed rgba(0, 212, 255, 0.3);
// // //   }
  
// // //   .empty-state p {
// // //     margin-bottom: 20px;
// // //     font-size: 1.1em;
// // //   }
  
// // //   /* Error state */
// // //   .error-state {
// // //     text-align: center;
// // //     padding: 40px 20px;
// // //     background: rgba(255, 0, 0, 0.1);
// // //     border-radius: 12px;
// // //     border: 1px solid rgba(255, 0, 0, 0.3);
// // //   }
  
// // //   .error-icon {
// // //     font-size: 3em;
// // //     margin-bottom: 20px;
// // //   }
  
// // //   .error-state h3 {
// // //     color: #ff6b6b;
// // //     margin-bottom: 15px;
// // //   }
  
// // //   .error-state ul {
// // //     text-align: left;
// // //     display: inline-block;
// // //     margin: 15px 0;
// // //   }
  
// // //   .error-detail {
// // //     font-size: 0.9em;
// // //     opacity: 0.8;
// // //     margin-top: 15px;
// // //   }
  
// // //   /* Button enhancements for mobile */
// // //   .btn {
// // //     position: relative;
// // //     overflow: hidden;
// // //   }
  
// // //   .btn-icon {
// // //     margin-right: 8px;
// // //     font-size: 1.1em;
// // //   }
  
// // //   .btn-text {
// // //     display: inline;
// // //   }
  
// // //   /* Mobile compact cards */
// // //   .model-card.mobile-compact {
// // //     padding: 15px;
// // //     min-height: 250px;
// // //   }
  
// // //   .model-card.mobile-compact .model-description {
// // //     font-size: 0.9em;
// // //     line-height: 1.4;
// // //   }
  
// // //   /* Mobile upload button */
// // //   .mobile-upload-btn {
// // //     font-size: 14px !important;
// // //     padding: 10px 15px !important;
// // //     white-space: nowrap;
// // //   }
  
// // //   /* Toast notifications */
// // //   .toast {
// // //     position: fixed;
// // //     top: 20px;
// // //     right: 20px;
// // //     background: rgba(0, 0, 0, 0.9);
// // //     color: white;
// // //     padding: 15px 20px;
// // //     border-radius: 8px;
// // //     border-left: 4px solid #00d4ff;
// // //     z-index: 10000;
// // //     max-width: 300px;
// // //     animation: slideIn 0.3s ease;
// // //   }
  
// // //   .toast-error {
// // //     border-left-color: #ff4757;
// // //   }
  
// // //   .toast-message {
// // //     margin-right: 10px;
// // //   }
  
// // //   .toast-close {
// // //     background: none;
// // //     border: none;
// // //     color: white;
// // //     font-size: 1.2em;
// // //     cursor: pointer;
// // //     padding: 0;
// // //     width: 20px;
// // //     height: 20px;
// // //   }
  
// // //   /* Mobile download modal */
// // //   .mobile-download-modal {
// // //     position: fixed;
// // //     top: 0;
// // //     left: 0;
// // //     width: 100%;
// // //     height: 100%;
// // //     background: rgba(0, 0, 0, 0.8);
// // //     z-index: 10000;
// // //     display: flex;
// // //     justify-content: center;
// // //     align-items: center;
// // //   }
  
// // //   .modal-content {
// // //     background: #1a1a2e;
// // //     padding: 25px;
// // //     border-radius: 12px;
// // //     max-width: 90%;
// // //     width: 400px;
// // //     position: relative;
// // //   }
  
// // //   .close-modal {
// // //     position: absolute;
// // //     top: 10px;
// // //     right: 15px;
// // //     background: none;
// // //     border: none;
// // //     color: white;
// // //     font-size: 1.5em;
// // //     cursor: pointer;
// // //   }
  
// // //   .modal-content h3 {
// // //     color: #00d4ff;
// // //     margin-bottom: 15px;
// // //   }
  
// // //   .modal-content ol {
// // //     text-align: left;
// // //     margin: 15px 0;
// // //     padding-left: 20px;
// // //   }
  
// // //   .modal-content li {
// // //     margin: 8px 0;
// // //   }
  
// // //   @keyframes slideIn {
// // //     from {
// // //       transform: translateX(100%);
// // //       opacity: 0;
// // //     }
// // //     to {
// // //       transform: translateX(0);
// // //       opacity: 1;
// // //     }
// // //   }
  
// // //   /* Responsive button text */
// // //   @media (max-width: 480px) {
// // //     .btn-text {
// // //       display: none;
// // //     }
    
// // //     .btn-icon {
// // //       margin-right: 0;
// // //       font-size: 1.3em;
// // //     }
    
// // //     .btn {
// // //       padding: 12px !important;
// // //       min-width: 44px; /* Minimum touch target size */
// // //       min-height: 44px;
// // //     }
    
// // //     .nav-button {
// // //       top: 70px !important; /* Ensure it doesn't overlap with title */
// // //       right: 10px;
// // //     }
// // //   }
  
// // //   @media (max-width: 360px) {
// // //     .model-card {
// // //       padding: 12px;
// // //     }
    
// // //     .card-actions {
// // //       gap: 8px;
// // //     }
// // //   }
// // // `;

// // Inject responsive styles
// const styleSheet = document.createElement('style');
// styleSheet.textContent = responsiveStyles;
// document.head.appendChild(styleSheet);

// script.js - UPDATED

async function loadModels() {
  try {
    console.log('Loading models...');
    
    // Show loading state
    const container = document.getElementById('modelsContainer');
    container.innerHTML = '<div class="loading-spinner">Loading models...</div>';
    
    const response = await fetch('https://threed-model-website.onrender.com/models');
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const models = await response.json();
    console.log('Models loaded:', models);

    container.innerHTML = '';

    if (models.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <p>No models uploaded yet.</p>
          <a href="upload.html" class="btn">Upload Your First Model</a>
        </div>
      `;
      return;
    }

    models.forEach(model => {
      // Use the correct filePath from the backend response
      const fullPath = 'https://threed-model-website.onrender.com' + model.filePath;
      console.log('Model path:', fullPath);

      const modelCard = document.createElement('div');
      modelCard.className = 'model-card';
      modelCard.innerHTML = `
        <div class="model-card-content">
          <h3>${escapeHtml(model.name)}</h3>
          <p><strong>Author:</strong> ${escapeHtml(model.author || "Unknown")}</p>
          <p class="model-description">${escapeHtml(model.description || "No description available.")}</p>
        </div>

        <!-- Actions container -->
        <div class="card-actions">
          <button class="btn view-btn" onclick="viewModel(event, '${escapeHtml(fullPath)}')">
            <span class="btn-text">View in 3D</span>
          </button>

          <button class="btn unity-btn" onclick="sendToUnity('${escapeHtml(fullPath)}')">
            <span class="btn-text">Open in Unity</span>
          </button>

          <button class="btn download-btn" onclick="downloadModel(event, '${escapeHtml(fullPath)}', '${escapeHtml(model.name)}')">
            <span class="btn-text">Download</span>
          </button>
        </div>
      `;
      container.appendChild(modelCard);
    });

  } catch (error) {
    console.error('Error loading models:', error);
    showErrorState(error);
  }
}

// Utility function to escape HTML
function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Show error state with retry option
function showErrorState(error) {
  const container = document.getElementById('modelsContainer');
  container.innerHTML = `
    <div class="error-state">
      <div class="error-icon">⚠️</div>
      <h3>Unable to Load Models</h3>
      <p>Please check:</p>
      <ul>
        <li>Your internet connection</li>
        <li>Server availability</li>
        <li>Console for detailed errors</li>
      </ul>
      <p class="error-detail">Error: ${escapeHtml(error.message)}</p>
      <button onclick="loadModels()" class="btn retry-btn">
        <span class="btn-icon">🔄</span>
        Try Again
      </button>
    </div>
  `;
}

// 3D Viewing (redirects to viewer.html)
// now receives event param safely
function viewModel(e, filePath) {
  console.log('Opening model:', filePath);
  
  const button = e?.target?.closest('.btn');
  if (button) {
    const originalHTML = button.innerHTML;
    button.innerHTML = '<span class="btn-icon">⏳</span> Loading...';
    button.disabled = true;
    
    setTimeout(() => {
      window.location.href = `viewer.html?model=${encodeURIComponent(filePath)}`;
    }, 500);
  } else {
    window.location.href = `viewer.html?model=${encodeURIComponent(filePath)}`;
  }
}

// Download Model (now receives event param)
function downloadModel(e, filePath, fileName) {
  try {
    const button = e?.target?.closest('.btn');
    if (button) {
      const originalHTML = button.innerHTML;
      button.innerHTML = '<span class="btn-icon">⏳</span> Downloading...';
      button.disabled = true;
      
      setTimeout(() => {
        button.innerHTML = originalHTML;
        button.disabled = false;
      }, 2000);
    }
    
    const extension = filePath.substring(filePath.lastIndexOf('.'));
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName + extension;
    link.target = '_blank';
    
    // Mobile-friendly download
    if (isMobileDevice()) {
      window.open(filePath, '_blank');
      setTimeout(() => {
        showMobileDownloadInstructions(fileName);
      }, 1000);
    } else {
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    console.log('Download initiated:', filePath);
    
  } catch (error) {
    console.error('Download error:', error);
    showToast('Download failed. Please try again.', 'error');
  }
}

// NEW: send model URL to backend which broadcasts to Unity clients
async function sendToUnity(modelUrl) {
  try {
    const res = await fetch('/api/select-model', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ modelUrl })
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Server responded ${res.status}: ${text}`);
    }

    console.log('📤 Sent model to Unity:', modelUrl);
    showToast('Sent to Unity!', 'info');
  } catch (err) {
    console.error('Failed to send to Unity:', err);
    showToast('Failed to send to Unity', 'error');
  }
}

// Check if device is mobile
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         window.innerWidth <= 768;
}

// Show mobile download instructions
function showMobileDownloadInstructions(fileName) {
  const instructions = `
    <div class="mobile-download-modal" id="downloadModal">
      <div class="modal-content">
        <button class="close-modal" onclick="closeDownloadModal()">×</button>
        <h3>Download Instructions</h3>
        <p>To download <strong>${escapeHtml(fileName)}</strong> on mobile:</p>
        <ol>
          <li>Tap and hold the file in the new tab</li>
          <li>Select "Download" or "Save to Files"</li>
          <li>Choose your preferred download location</li>
        </ol>
        <button class="btn" onclick="closeDownloadModal()">Got It</button>
      </div>
    </div>
  `;
  
  const existingModal = document.getElementById('downloadModal');
  if (!existingModal) {
    document.body.insertAdjacentHTML('beforeend', instructions);
  }
}

// Close download modal
function closeDownloadModal() {
  const modal = document.getElementById('downloadModal');
  if (modal) {
    modal.remove();
  }
}

// Show toast notification
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-message">${escapeHtml(message)}</span>
    <button class="toast-close" onclick="this.parentNode.remove()">×</button>
  `;
  
  document.body.appendChild(toast);
  
  // Auto-remove after 4 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.remove();
    }
  }, 4000);
}

// Handle responsive layout changes
function handleResponsiveLayout() {
  const container = document.getElementById('modelsContainer');
  const cards = document.querySelectorAll('.model-card');
  
  if (window.innerWidth <= 480) {
    cards.forEach(card => {
      card.classList.add('mobile-compact');
    });
  } else if (window.innerWidth <= 768) {
    cards.forEach(card => {
      card.classList.remove('mobile-compact');
    });
  } else {
    cards.forEach(card => {
      card.classList.remove('mobile-compact');
    });
  }
}

// Fix upload button positioning for mobile
function fixUploadButtonPosition() {
  const uploadButton = document.querySelector('a[href="upload.html"]');
  const navButton = document.querySelector('.nav-button');
  
  if (uploadButton && navButton && isMobileDevice()) {
    const title = document.querySelector('h1');
    if (title) {
      const titleRect = title.getBoundingClientRect();
      const navRect = navButton.getBoundingClientRect();
      
      if (navRect.top < titleRect.bottom + 20) {
        navButton.style.top = `${titleRect.bottom + 30}px`;
      }
    }
    
    // Add mobile-specific class for better styling
    uploadButton.classList.add('mobile-upload-btn');
  }
}

// Enhanced error handling for Three.js
window.addEventListener('error', function(e) {
  console.error('Global error:', e.error);
  
  if (e.error && e.error.message && e.error.message.includes('Three')) {
    showToast('3D Viewer error. Please try refreshing the page.', 'error');
  }
});

// Load models on page load
window.onload = function() {
  loadModels();
  fixUploadButtonPosition();
  
  window.addEventListener('resize', () => {
    handleResponsiveLayout();
    fixUploadButtonPosition();
  });
  
  setTimeout(handleResponsiveLayout, 100);
};

// Injected responsive styles (unchanged from your file)
const responsiveStyles = `
   /* Loading states */
   .loading-spinner {
    text-align: center;
    padding: 40px;
    color: #00d4ff;
    font-size: 1.1em;
   }
  
 /* Empty state */
  .empty-state {
     text-align: center;
  padding: 60px 20px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    border: 2px dashed rgba(0, 212, 255, 0.3);
   }
  
  .empty-state p {
      margin-bottom: 20px;
    font-size: 1.1em;
  }
  
  /* Error state */
  .error-state {
    text-align: center;
     padding: 40px 20px;
     background: rgba(255, 0, 0, 0.1);
    border-radius: 12px;
   border: 1px solid rgba(255, 0, 0, 0.3);
 }
  
   .error-icon {
     font-size: 3em;
     margin-bottom: 20px;
  }
  
   .error-state h3 {
     color: #ff6b6b;
     margin-bottom: 15px;
  }
  
  .error-state ul {
     text-align: left;
     display: inline-block;
    margin: 15px 0;
   }
  
   .error-detail {
    font-size: 0.9em;
   opacity: 0.8;
    margin-top: 15px;
  }
  
// //   /* Button enhancements for mobile */
  .btn {
     position: relative;
    overflow: hidden;
   }
  
  .btn-icon {
    margin-right: 8px;
    font-size: 1.1em;
  }
  
  .btn-text {
    display: inline;
   }
  
// //   /* Mobile compact cards */
  .model-card.mobile-compact {
    padding: 15px;
    min-height: 250px;
  }
  
   .model-card.mobile-compact .model-description {
    font-size: 0.9em;
   line-height: 1.4;
  }
  
   /* Mobile upload button */
   .mobile-upload-btn {
     font-size: 14px !important;
    padding: 10px 15px !important;
     white-space: nowrap;
  }
  
   /* Toast notifications */
  .toast {
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.9);
   color: white;
     padding: 15px 20px;
     border-radius: 8px;
    border-left: 4px solid #00d4ff;
     z-index: 10000;
     max-width: 300px;
    animation: slideIn 0.3s ease;
   }
  
   .toast-error {
    border-left-color: #ff4757;
   }
  
  .toast-message {
    margin-right: 10px;
  }
  
 .toast-close {
   background: none;
   border: none;
   color: white;
   font-size: 1.2em;
   cursor: pointer;
   padding: 0;
   width: 20px;
   height: 20px;
  }
  
  /* Mobile download modal */
.mobile-download-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
   z-index: 10000;
   display: flex;
  justify-content: center;
  align-items: center;
  }
  
  .modal-content {
    background: #1a1a2e;
    padding: 25px;
    border-radius: 12px;
    max-width: 90%;
    width: 400px;
    position: relative;
   }
  
   .close-modal {
     position: absolute;
     top: 10px;
     right: 15px;
     background: none;
     border: none;
     color: white;
     font-size: 1.5em;
    cursor: pointer;
   }
  
   .modal-content h3 {
    color: #00d4ff;
     margin-bottom: 15px;
   }
  
  .modal-content ol {
     text-align: left;
   margin: 15px 0;
    padding-left: 20px;
   }
  
  .modal-content li {
    margin: 8px 0;
  }
  
  @keyframes slideIn {
     from {
      transform: translateX(100%);
       opacity: 0;
    }
     to {
       transform: translateX(0);
       opacity: 1;
     }
   }
  
   /* Responsive button text */
   @media (max-width: 480px) {
    .btn-text {
      display: none;
    }
    
     .btn-icon {
       margin-right: 0;
      font-size: 1.3em;
     }
    
    .btn {
       padding: 12px !important;
       min-width: 44px; /* Minimum touch target size */
       min-height: 44px;
     }
    
     .nav-button {
       top: 70px !important; /* Ensure it doesn't overlap with title */
       right: 10px;
     }
   }
  
   @media (max-width: 360px) {
    .model-card {
       padding: 12px;
     }
    
     .card-actions {
       gap: 8px;
     }
   }
 `;
// Inject responsive styles only if not already present
if (!document.getElementById('responsive-styles-injected')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'responsive-styles-injected';
  styleSheet.textContent = responsiveStyles;
  document.head.appendChild(styleSheet);
}
