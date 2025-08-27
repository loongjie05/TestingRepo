document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Element Selection ---
  const createPostForm = document.getElementById('create-post-form');
  const foodNameInput = document.getElementById('food-name');
  const postContentInput = document.getElementById('post-content');
  const postsFeedContainer = document.getElementById('posts-feed');
  const postLocationInput = document.getElementById('post-location');
  const getLocationBtn = document.getElementById('get-location-btn');
  const postFeelingSelect = document.getElementById('post-feeling');
  const postFeelingCustom = document.getElementById('post-feeling-custom');
  
  // Media upload elements
  const mediaUploadInput = document.getElementById('media-upload');
  const mediaDropZone = document.getElementById('media-drop-zone');
  const browseLink = document.getElementById('browse-link');
  const mediaPreviewArea = document.getElementById('media-preview-area');
  const mediaPreviewGrid = document.getElementById('media-preview-grid');
  const clearAllMediaBtn = document.getElementById('clear-all-media');
  const uploadProgress = document.getElementById('upload-progress');
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');

  // --- Configuration ---
  const COMMENT_DISPLAY_LIMIT = 2; // Number of comments to show initially
  const GEOAPIFY_API_KEY = '3cc1eb78093c4c35bfd3445bb50d8026';
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB max file size
  const MAX_FILES = 10; // Maximum number of files

  // --- Map and Location Variables ---
  let map;
  let selectedMarker;
  let selectedLatLng;
  let searchTimeout;

  // --- Media Upload Variables ---
  let uploadedFiles = [];
  let fileCounter = 0;

  // --- Helper to get current user's name (from login cookie) ---
  function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  // This function now checks for an *active session* cookie
  function getCurrentUser() {
    const activeSessionCookie = getCookie('activeUserSession');
    if (activeSessionCookie) {
        return activeSessionCookie; // Return the username from the active session cookie
    }
    return "A Food Lover"; // Fallback name if no active session
  }

  // --- Media Upload Functions ---
  
  // Format file size for display
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  
  // Validate file type and size
  function validateFile(file) {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      alert(`File "${file.name}" is too large. Maximum size is 50MB.`);
      return false;
    }

    // Check file type
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'
    ];

    if (!allowedTypes.includes(file.type)) {
      alert(`File type "${file.type}" is not supported. Please use images, videos, or audio files.`);
      return false;
    }

    return true;
  }

  // Process and add files to upload queue
  function processFiles(files) {
    const validFiles = Array.from(files).filter(validateFile);
    
    if (uploadedFiles.length + validFiles.length > MAX_FILES) {
      alert(`You can only upload up to ${MAX_FILES} files.`);
      return;
    }

    validFiles.forEach(file => {
      const fileObj = {
        id: ++fileCounter,
        file: file,
        name: file.name,
        type: file.type,
        size: file.size,
        preview: null
      };

      uploadedFiles.push(fileObj);
      generatePreview(fileObj);
    });

    updatePreviewArea();
  }

  // Generate preview for different file types
  function generatePreview(fileObj) {
    const reader = new FileReader();

    reader.onload = function(e) {
      fileObj.preview = e.target.result;
      updatePreviewDisplay();
    };

    if (fileObj.type.startsWith('image/')) {
      reader.readAsDataURL(fileObj.file);
    } else if (fileObj.type.startsWith('video/')) {
      reader.readAsDataURL(fileObj.file);
    }
  }

  // Update preview area visibility and content
  function updatePreviewArea() {
    if (uploadedFiles.length > 0) {
      mediaPreviewArea.style.display = 'block';
      updatePreviewDisplay();
    } else {
      mediaPreviewArea.style.display = 'none';
    }
  }

  // Update the preview display grid
  function updatePreviewDisplay() {
    mediaPreviewGrid.innerHTML = '';

    uploadedFiles.forEach(fileObj => {
      const previewItem = document.createElement('div');
      previewItem.className = 'media-preview-item';
      previewItem.dataset.fileId = fileObj.id;

      let content = '';
      
      if (fileObj.type.startsWith('image/')) {
        content = `
          <img src="${fileObj.preview || ''}" alt="${fileObj.name}" />
          <button class="remove-media-btn" onclick="removeFile(${fileObj.id})">
            <i class="fas fa-times"></i>
          </button>
        `;
      } else if (fileObj.type.startsWith('video/')) {
        content = `
          <video src="${fileObj.preview || ''}" muted></video>
          <div class="media-overlay">
            <i class="fas fa-play"></i>
          </div>
          <button class="remove-media-btn" onclick="removeFile(${fileObj.id})">
            <i class="fas fa-times"></i>
          </button>
        `;
      }

      previewItem.innerHTML = content;
      mediaPreviewGrid.appendChild(previewItem);
    });
  }

  // Remove a file from the upload queue
  window.removeFile = function(fileId) {
    uploadedFiles = uploadedFiles.filter(file => file.id !== fileId);
    updatePreviewArea();
  };

  // Clear all uploaded files
  function clearAllFiles() {
    uploadedFiles = [];
    updatePreviewArea();
  }

  // Simulate file upload progress
  function simulateUpload() {
    if (uploadedFiles.length === 0) return Promise.resolve();

    return new Promise((resolve) => {
      uploadProgress.style.display = 'block';
      progressFill.style.width = '0%';
      progressText.textContent = 'Uploading files...';

      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          progressFill.style.width = '100%';
          progressText.textContent = 'Upload complete!';
          
          setTimeout(() => {
            uploadProgress.style.display = 'none';
            resolve();
          }, 1000);
        } else {
          progressFill.style.width = progress + '%';
          progressText.textContent = `Uploading... ${Math.round(progress)}%`;
        }
      }, 100);
    });
  }

  // Generate media HTML for posts
  function generateMediaHTML(mediaFiles) {
    if (!mediaFiles || mediaFiles.length === 0) return '';

    const mediaCount = mediaFiles.length;
    let gridClass = 'single';
    
    if (mediaCount === 2) gridClass = 'double';
    else if (mediaCount === 3) gridClass = 'triple';
    else if (mediaCount === 4) gridClass = 'quad';
    else if (mediaCount > 4) gridClass = 'many';

    let mediaHTML = `<div class="post-media"><div class="post-media-grid ${gridClass}">`;
    
    const displayFiles = mediaCount > 5 ? mediaFiles.slice(0, 5) : mediaFiles;
    
    displayFiles.forEach((media, index) => {
      if (media.type.startsWith('image/')) {
        mediaHTML += `
          <div class="media-item" onclick="openMediaViewer('${media.preview}', 'image')">
            <img src="${media.preview}" alt="Food photo" />
            <div class="media-overlay">
              <i class="fas fa-expand"></i>
            </div>
          </div>
        `;
      } else if (media.type.startsWith('video/')) {
        mediaHTML += `
          <div class="media-item" onclick="openMediaViewer('${media.preview}', 'video')">
            <video src="${media.preview}" muted></video>
            <div class="media-overlay">
              <i class="fas fa-play"></i>
            </div>
          </div>
        `;
      }
    });

    if (mediaCount > 5) {
      mediaHTML += `
        <div class="media-item more-media" onclick="showAllMedia()">
          <div class="audio-item">
            <i class="fas fa-plus"></i>
            <div class="audio-filename">+${mediaCount - 5} more</div>
          </div>
        </div>
      `;
    }

    mediaHTML += '</div></div>';
    return mediaHTML;
  }

  // Open media viewer with modal overlay
  window.openMediaViewer = function(src, type) {
    if (type === 'image') {
      // Create modal for image fullscreen view
      const modal = document.createElement('div');
      modal.className = 'media-modal';
      modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.9); display: flex; align-items: center;
        justify-content: center; z-index: 10000; cursor: pointer;
      `;
      
      const img = document.createElement('img');
      img.src = src;
      img.style.cssText = `
        max-width: 95%; max-height: 95%; object-fit: contain;
        border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      `;
      
      // Add close button
      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '&times;';
      closeBtn.style.cssText = `
        position: absolute; top: 20px; right: 30px; background: rgba(255,255,255,0.2);
        color: white; border: none; font-size: 30px; cursor: pointer;
        width: 50px; height: 50px; border-radius: 50%; display: flex;
        align-items: center; justify-content: center; transition: background 0.3s;
      `;
      closeBtn.onmouseover = () => closeBtn.style.background = 'rgba(255,255,255,0.3)';
      closeBtn.onmouseout = () => closeBtn.style.background = 'rgba(255,255,255,0.2)';
      closeBtn.onclick = (e) => {
        e.stopPropagation();
        document.body.removeChild(modal);
      };
      
      modal.appendChild(img);
      modal.appendChild(closeBtn);
      modal.onclick = () => document.body.removeChild(modal);
      document.body.appendChild(modal);
      
    } else if (type === 'video') {
      const video = document.createElement('video');
      video.src = src;
      video.controls = true;
      video.style.maxWidth = '100%';
      video.style.maxHeight = '80vh';
      
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.8); display: flex; align-items: center;
        justify-content: center; z-index: 10000; cursor: pointer;
      `;
      modal.appendChild(video);
      modal.onclick = () => document.body.removeChild(modal);
      document.body.appendChild(modal);
    }
  };

  // Show all media (placeholder function)
  window.showAllMedia = function() {
    alert('Feature coming soon: View all media in gallery');
  };

  // --- Event Listeners for Media Upload ---
  
  // Browse link click
  browseLink.addEventListener('click', (e) => {
    e.preventDefault();
    mediaUploadInput.click();
  });

  // Drop zone click
  mediaDropZone.addEventListener('click', (e) => {
    if (e.target === mediaDropZone || e.target.closest('.drop-zone-content')) {
      mediaUploadInput.click();
    }
  });

  // File input change
  mediaUploadInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = ''; // Reset input
    }
  });

  // Drag and drop events
  mediaDropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    mediaDropZone.classList.add('drag-over');
  });

  mediaDropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    if (!mediaDropZone.contains(e.relatedTarget)) {
      mediaDropZone.classList.remove('drag-over');
    }
  });

  mediaDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    mediaDropZone.classList.remove('drag-over');
    
    if (e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  });

  // Clear all media button
  clearAllMediaBtn.addEventListener('click', clearAllFiles);

  // --- Map and Location Functions ---
  
  // Initialize the map
  function initMap() {
    // Create map centered on a default location (Kuala Lumpur)
    map = L.map('map-container').setView([3.1390, 101.6869], 10);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Add click event to map
    map.on('click', onMapClick);
  }
  
  // Handle map click to select location
  function onMapClick(e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    
    // Remove previous marker if exists
    if (selectedMarker) {
      map.removeLayer(selectedMarker);
    }
    
    // Add new marker at clicked location
    selectedMarker = L.marker([lat, lng]).addTo(map);
    
    // Update selected coordinates display
    document.getElementById('selected-coordinates').textContent = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    
    // Store selected coordinates
    selectedLatLng = { lat, lng };
    
    // Enable confirm button
    document.getElementById('confirm-location-btn').disabled = false;
  }
  
  // Show map modal
  function showMapModal() {
    const modal = document.getElementById('map-modal');
    modal.style.display = 'flex';
    
    // Add animation class
    setTimeout(() => {
      modal.classList.add('show');
    }, 10);
    
    // Initialize map if not already done
    if (!map) {
      setTimeout(() => {
        initMap();
      }, 100);
    }
    
    // Reset selection
    selectedLatLng = null;
    if (selectedMarker) {
      map.removeLayer(selectedMarker);
      selectedMarker = null;
    }
    document.getElementById('selected-coordinates').textContent = 'None';
    document.getElementById('confirm-location-btn').disabled = true;
    
    // Reset search
    document.getElementById('address-search-input').value = '';
    document.getElementById('search-results').style.display = 'none';
  }
  
  // Hide map modal
  function hideMapModal() {
    const modal = document.getElementById('map-modal');
    modal.classList.remove('show');
    
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);
  }
  
  // Get address from coordinates using Geoapify reverse geocoding
  async function getAddressFromCoordinates(lat, lng) {
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${GEOAPIFY_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        const properties = feature.properties;
        
        // Create a readable address
        let address = '';
        if (properties.name) {
          address = properties.name;
        } else if (properties.street && properties.housenumber) {
          address = `${properties.street} ${properties.housenumber}`;
        } else if (properties.street) {
          address = properties.street;
        }
        
        if (properties.city) {
          address += address ? `, ${properties.city}` : properties.city;
        } else if (properties.town) {
          address += address ? `, ${properties.town}` : properties.town;
        } else if (properties.village) {
          address += address ? `, ${properties.village}` : properties.village;
        }
        
        return address || 'Unknown Location';
      }
      
      return 'Unknown Location';
    } catch (error) {
      console.error('Error fetching address:', error);
      return `Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  }
  
  // Search for addresses using Geoapify forward geocoding
  async function searchAddresses(query) {
    if (!query.trim()) return [];
    
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(query)}&apiKey=${GEOAPIFY_API_KEY}&limit=5`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        return data.features.map(feature => ({
          name: feature.properties.formatted,
          lat: feature.geometry.coordinates[1],
          lng: feature.geometry.coordinates[0],
          city: feature.properties.city || feature.properties.town || feature.properties.village,
          country: feature.properties.country,
          street: feature.properties.street,
          housenumber: feature.properties.housenumber
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error searching addresses:', error);
      return [];
    }
  }
  
  // Display search results
  function displaySearchResults(results) {
    const searchResultsContainer = document.getElementById('search-results');
    
    if (results.length === 0) {
      searchResultsContainer.innerHTML = '<div class="search-result-item">No results found</div>';
      searchResultsContainer.style.display = 'block';
      return;
    }
    
    searchResultsContainer.innerHTML = '';
    
    results.forEach(result => {
      const resultItem = document.createElement('div');
      resultItem.className = 'search-result-item';
      
      // Create display text
      let displayName = result.name;
      if (result.street && result.housenumber) {
        displayName = `${result.street} ${result.housenumber}`;
        if (result.city) displayName += `, ${result.city}`;
        if (result.country) displayName += `, ${result.country}`;
      }
      
      resultItem.innerHTML = `
        <div class="search-result-name">${displayName}</div>
        <div class="search-result-details">${result.lat.toFixed(4)}, ${result.lng.toFixed(4)}</div>
      `;
      
      resultItem.addEventListener('click', () => {
        // Move map to selected location
        map.setView([result.lat, result.lng], 16);
        
        // Remove previous marker if exists
        if (selectedMarker) {
          map.removeLayer(selectedMarker);
        }
        
        // Add marker at selected location
        selectedMarker = L.marker([result.lat, result.lng]).addTo(map);
        
        // Update selected coordinates
        selectedLatLng = { lat: result.lat, lng: result.lng };
        document.getElementById('selected-coordinates').textContent = `${result.lat.toFixed(6)}, ${result.lng.toFixed(6)}`;
        
        // Enable confirm button
        document.getElementById('confirm-location-btn').disabled = false;
        
        // Hide search results
        searchResultsContainer.style.display = 'none';
        
        // Clear search input
        document.getElementById('address-search-input').value = '';
      });
      
      searchResultsContainer.appendChild(resultItem);
    });
    
    searchResultsContainer.style.display = 'block';
  }
  
  // Handle address search input
  function handleAddressSearch() {
    const query = document.getElementById('address-search-input').value.trim();
    const searchResultsContainer = document.getElementById('search-results');
    
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Hide results if input is empty
    if (!query) {
      searchResultsContainer.style.display = 'none';
      return;
    }
    
    // Debounce search to avoid too many API calls
    searchTimeout = setTimeout(async () => {
      const results = await searchAddresses(query);
      displaySearchResults(results);
    }, 300);
  }
  
  // Confirm location selection
  async function confirmLocation() {
    if (selectedLatLng) {
      postLocationInput.value = 'Getting address...';
      
      const address = await getAddressFromCoordinates(selectedLatLng.lat, selectedLatLng.lng);
      postLocationInput.value = address;
      
      // Store coordinates for potential future use
      postLocationInput.dataset.lat = selectedLatLng.lat;
      postLocationInput.dataset.lng = selectedLatLng.lng;
      
      hideMapModal();
    }
  }
  
  // Event listeners for map functionality
  getLocationBtn.addEventListener('click', showMapModal);
  postLocationInput.addEventListener('click', showMapModal); // Make input clickable to show map
  document.getElementById('close-map-btn').addEventListener('click', hideMapModal);
  document.getElementById('cancel-location-btn').addEventListener('click', hideMapModal);
  document.getElementById('confirm-location-btn').addEventListener('click', confirmLocation);
  
  // Event listeners for address search
  document.getElementById('address-search-input').addEventListener('input', handleAddressSearch);
  document.getElementById('search-address-btn').addEventListener('click', handleAddressSearch);
  
  // Close modal when clicking outside
  document.getElementById('map-modal').addEventListener('click', (e) => {
    if (e.target.id === 'map-modal') {
      hideMapModal();
    }
  });

  // Allow custom feeling text when selecting "custom"
  postFeelingSelect.addEventListener('change', () => {
    if (postFeelingSelect.value === 'custom') {
      postFeelingCustom.style.display = 'block';
      postFeelingCustom.focus();
    } else {
      postFeelingCustom.style.display = 'none';
    }
  });

  // --- Function to render a single comment ---
  function renderComment(commentListContainer, comment, postId) {
    const commentElement = document.createElement('div');
    commentElement.classList.add('comment');
    commentElement.dataset.commentId = comment.id;
    commentElement.dataset.postId = postId; // Add postId to comment element

    const currentUser = getCurrentUser();
    const isLiked = comment.likedBy && comment.likedBy.includes(currentUser) ? 'liked' : '';

    commentElement.innerHTML = `
      <span class="comment-author">${comment.author}:</span>
      <span>${comment.content}</span>
      <div class="comment-actions">
        <button class="reaction-button comment-like-button ${isLiked}" data-action="like">
          <svg class="reaction-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
          </svg>
          <span class="reaction-count">${comment.likes}</span>
        </button>
        <button class="reaction-button comment-delete-button" data-action="delete" title="Delete comment">🗑️</button>
      </div>
    `;

    commentListContainer.appendChild(commentElement);

    commentElement.querySelector('.comment-like-button').addEventListener('click', (event) => handleCommentLikeDislike(event, postId, comment.id));
    commentElement.querySelector('.comment-delete-button').addEventListener('click', (event) => handleDeleteComment(event, postId, comment.id));
  }

  // --- Function to render all comments for a post ---
  function renderComments(postCard, postId) {
    const commentsSection = postCard.querySelector('.comments-section');
    
    // Fetch the latest comments for this post from localStorage
    const storedPosts = JSON.parse(localStorage.getItem('foodPosts')) || [];
    const post = storedPosts.find(p => p.id == postId);
    if (!post) return; // Should not happen if postId is valid
    const comments = post.comments; // Get the latest comments

    // Clear existing content except for the add comment form if it exists
    const existingAddCommentForm = commentsSection.querySelector('.add-comment-form');
    commentsSection.innerHTML = `<h4>Comments</h4><div class="comments-list"></div>`;
    if (existingAddCommentForm) {
      commentsSection.appendChild(existingAddCommentForm);
    } else {
        commentsSection.innerHTML += `
          <form class="add-comment-form">
            <input type="text" placeholder="Add a comment..." required>
            <button type="submit">Comment</button>
          </form>
        `;
    }

    const commentListContainer = commentsSection.querySelector('.comments-list');
    
    // Render comments based on the display limit
    const commentsToRender = comments.slice(0, COMMENT_DISPLAY_LIMIT);
    commentsToRender.forEach(comment => renderComment(commentListContainer, comment, postId));

    // If there are more comments than the limit, add a "View more" button
    if (comments.length > COMMENT_DISPLAY_LIMIT) {
      const showMoreButton = document.createElement('button');
      showMoreButton.classList.add('show-more-comments-button');
      showMoreButton.textContent = `View all ${comments.length} comments`;
      showMoreButton.addEventListener('click', () => toggleCommentsExpansion(commentListContainer, postId, showMoreButton));
      commentsSection.insertBefore(showMoreButton, commentsSection.querySelector('.add-comment-form'));
    }

    // Add event listener for the comment form
    commentsSection.querySelector('.add-comment-form').addEventListener('submit', (event) => handleAddComment(event, postId));
  }

  // --- Function to toggle comments expansion ---
  function toggleCommentsExpansion(commentListContainer, postId, button) {
    const storedPosts = JSON.parse(localStorage.getItem('foodPosts')) || [];
    const post = storedPosts.find(p => p.id == postId);

    if (!post) return; // Guard clause

    const allComments = post.comments; // Get the latest comments from localStorage

    const isExpanded = commentListContainer.classList.toggle('expanded');
    if (isExpanded) {
      // Clear current comments and render all of them
      commentListContainer.innerHTML = '';
      allComments.forEach(comment => renderComment(commentListContainer, comment, postId));
      button.textContent = 'View less comments';
    } else {
      // Clear current comments and render only the limited ones
      commentListContainer.innerHTML = '';
      const commentsToRender = allComments.slice(0, COMMENT_DISPLAY_LIMIT);
      commentsToRender.forEach(comment => renderComment(commentListContainer, comment, postId));
      button.textContent = `View all ${allComments.length} comments`;
    }
  }


  // --- Function to render a single post ---
  function renderPost(post, favoriteFoods) {
    const postCard = document.createElement('div');
    postCard.classList.add('post-card');
    postCard.dataset.postId = post.id; // Use a unique ID for each post

    const postDate = new Date(post.timestamp).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

    const currentUser = getCurrentUser();
    const hasLiked = post.likedBy && post.likedBy.includes(currentUser);

    // Display feeling if available
    const feelingDisplay = post.feeling ? `<span class="post-feeling"> &mdash; Feeling: ${post.feeling}</span>` : '';
    // Display location if available
    const locationDisplay = post.location ? `<span class="post-location"> &bull; At: ${post.location}</span>` : '';
    // Generate media HTML if available
    const mediaHTML = generateMediaHTML(post.media);

    const isFavorite = favoriteFoods.includes(post.foodName);
    const favoriteButtonText = isFavorite ? 'Remove from Favorites' : 'Add to Favorites';

    // This HTML structure matches your food-feed.css styles
    postCard.innerHTML = `
      <div class="post-header">
        <span class="post-author">${post.author}</span>
        <span class="post-date">${postDate}</span>
        ${feelingDisplay}
        ${locationDisplay}
      </div>
      <div class="post-body">
        <h3>${post.foodName}</h3>
        <p>${post.content}</p>
        ${mediaHTML}
      </div>
      <div class="post-actions">
        <button class="reaction-button post-like-button ${hasLiked ? 'liked' : ''}" data-action="like">
          <svg class="reaction-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <span class="reaction-count">${post.likes}</span>
        </button>
        <button class="reaction-button post-delete-button" data-action="delete" title="Delete post">🗑️ Delete</button>
        <button class="favorite-button" data-action="favorite">${favoriteButtonText}</button>
      </div>
      <div class="comments-section">
        <!-- Comments will be dynamically inserted here by renderComments function -->
      </div>
    `;

    // Add the new post to the top of the feed
    postsFeedContainer.prepend(postCard);

    // Add event listener for the post like button
    postCard.querySelector('.post-like-button').addEventListener('click', handleLikeClick);
    // Add event listener for delete post
    postCard.querySelector('.post-delete-button').addEventListener('click', handleDeletePost);

    // Add event listener for favorite button
    postCard.querySelector('.favorite-button').addEventListener('click', handleFavoriteClick);

    // Render comments for the post
    renderComments(postCard, post.id);
  }

  // --- Handle Favorite Button Click ---
  function handleFavoriteClick(event) {
    const favoriteButton = event.currentTarget;
    const postCard = favoriteButton.closest('.post-card');
    const postId = postCard.dataset.postId;
    const foodName = postCard.querySelector('h3').textContent;

    let favoriteFoods = JSON.parse(localStorage.getItem('favoriteFoods')) || [];
    const isFavorite = favoriteFoods.includes(foodName);

    if (isFavorite) {
      // Remove from favorites
      favoriteFoods = favoriteFoods.filter(food => food !== foodName);
      favoriteButton.textContent = 'Add to Favorites';
    } else {
      // Add to favorites
      favoriteFoods.push(foodName);
      favoriteButton.textContent = 'Remove from Favorites';
    }

    localStorage.setItem('favoriteFoods', JSON.stringify(favoriteFoods));
    
    // Update user account data
    updateUserFavorites(favoriteFoods);
  }

  // --- Handle Like Button Click for posts ---
  function handleLikeClick(event) {
    const likeButton = event.currentTarget;
    const postCard = likeButton.closest('.post-card');
    const postId = postCard.dataset.postId;
    const currentUser = getCurrentUser();

    const storedPosts = JSON.parse(localStorage.getItem('foodPosts')) || [];
    const postIndex = storedPosts.findIndex(p => p.id == postId);

    if (postIndex > -1) {
      const post = storedPosts[postIndex];
      let likedBy = post.likedBy || [];
      const userLiked = likedBy.includes(currentUser);

      if (userLiked) {
        // User already liked, so unlike
        post.likes--;
        post.likedBy = likedBy.filter(user => user !== currentUser);
        likeButton.classList.remove('liked');
      } else {
        // User likes
        post.likes++;
        post.likedBy.push(currentUser);
        likeButton.classList.add('liked');

        // Trigger animation on like
        const reactionIcon = likeButton.querySelector('.reaction-icon');
        reactionIcon.classList.add('animate-pulse');
        reactionIcon.addEventListener('animationend', () => {
          reactionIcon.classList.remove('animate-pulse');
        }, { once: true });
      }
      
      localStorage.setItem('foodPosts', JSON.stringify(storedPosts));
      likeButton.querySelector('.reaction-count').textContent = post.likes;
    }
  }

  // --- Handle Delete Post ---
  function handleDeletePost(event) {
    const postCard = event.currentTarget.closest('.post-card');
    const postId = postCard.dataset.postId;
    const storedPosts = JSON.parse(localStorage.getItem('foodPosts')) || [];
    const updated = storedPosts.filter(p => p.id != postId);
    localStorage.setItem('foodPosts', JSON.stringify(updated));
    postCard.remove();
  }

  // --- Handle Add Comment ---
  function handleAddComment(event, postId) {
    event.preventDefault();
    const commentInput = event.target.querySelector('input[type="text"]');
    const commentContent = commentInput.value.trim();

    if (commentContent) {
      const newComment = {
        id: Date.now(),
        author: getCurrentUser(),
        content: commentContent,
        likes: 0,
        likedBy: [], // To track users who liked this comment
      };

      const storedPosts = JSON.parse(localStorage.getItem('foodPosts')) || [];
      const postIndex = storedPosts.findIndex(p => p.id == postId);

      if (postIndex > -1) {
        storedPosts[postIndex].comments.push(newComment);
        localStorage.setItem('foodPosts', JSON.stringify(storedPosts));

        // Re-render comments for this post to update the list and potentially the "View more" button
        const postCard = event.target.closest('.post-card');
        renderComments(postCard, postId); 
        
        commentInput.value = ''; // Clear the comment input
      }
    }
  }

  // --- Handle Comment Like/Dislike ---
  function handleCommentLikeDislike(event, postId, commentId) {
    const likeButton = event.currentTarget;
    const currentUser = getCurrentUser();
    
    const storedPosts = JSON.parse(localStorage.getItem('foodPosts')) || [];
    const postIndex = storedPosts.findIndex(p => p.id == postId);

    if (postIndex > -1) {
      const commentIndex = storedPosts[postIndex].comments.findIndex(c => c.id == commentId);

      if (commentIndex > -1) {
        const comment = storedPosts[postIndex].comments[commentIndex];

        let likedBy = comment.likedBy || [];
        const userLiked = likedBy.includes(currentUser);

        if (userLiked) {
          // User already liked, so unlike
          comment.likes--;
          comment.likedBy = likedBy.filter(user => user !== currentUser);
          likeButton.classList.remove('liked');
        } else {
          // User likes
          comment.likes++;
          comment.likedBy.push(currentUser);
          likeButton.classList.add('liked');

          // Trigger animation on like
          const reactionIcon = likeButton.querySelector('.reaction-icon');
          reactionIcon.classList.add('animate-pulse');
          reactionIcon.addEventListener('animationend', () => {
            reactionIcon.classList.remove('animate-pulse');
          }, { once: true });
        }

        localStorage.setItem('foodPosts', JSON.stringify(storedPosts));

        // Update the UI for the specific comment
        likeButton.querySelector('.reaction-count').textContent = comment.likes;
      }
    }
  }

  // --- Handle Delete Comment ---
  function handleDeleteComment(event, postId, commentId) {
    const storedPosts = JSON.parse(localStorage.getItem('foodPosts')) || [];
    const postIndex = storedPosts.findIndex(p => p.id == postId);
    if (postIndex === -1) return;
    storedPosts[postIndex].comments = storedPosts[postIndex].comments.filter(c => c.id != commentId);
    localStorage.setItem('foodPosts', JSON.stringify(storedPosts));
    // Re-render comments for this post
    const postCard = event.currentTarget.closest('.post-card');
    renderComments(postCard, postId);
  }

  // --- Load existing posts from localStorage on page load ---
  function loadPosts() {
    const storedPosts = JSON.parse(localStorage.getItem('foodPosts')) || [];
    const favoriteFoods = JSON.parse(localStorage.getItem('favoriteFoods')) || [];
    postsFeedContainer.innerHTML = ''; // Clear the feed before loading
    storedPosts.slice().reverse().forEach(post => renderPost(post, favoriteFoods)); // Show newest first
  }

  // --- Handle form submission ---
  createPostForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // This is crucial - it stops the page from reloading!

    // Show upload progress if there are files
    if (uploadedFiles.length > 0) {
      await simulateUpload();
    }

    const newPost = {
      id: Date.now(), // Simple unique ID using the current timestamp
      author: getCurrentUser(),
      foodName: foodNameInput.value.trim(),
      content: postContentInput.value.trim(),
      timestamp: new Date().toISOString(),
      likes: 0,
      likedBy: [], // Track users who liked this post
      comments: [], // Initialize comments array for new posts
      location: postLocationInput.value.trim(), // Get location from input
      feeling: (postFeelingSelect.value === 'custom' ? postFeelingCustom.value.trim() : postFeelingSelect.value),
      media: uploadedFiles.map(file => ({
        id: file.id,
        name: file.name,
        type: file.type,
        size: file.size,
        preview: file.preview
      })) // Store media files with post
    };

    const storedPosts = JSON.parse(localStorage.getItem('foodPosts')) || [];
    storedPosts.push(newPost);
    localStorage.setItem('foodPosts', JSON.stringify(storedPosts));

    renderPost(newPost, JSON.parse(localStorage.getItem('favoriteFoods')) || []); // Display the new post immediately

    // Clear the form and media files
    createPostForm.reset(); // Clear the form fields
    postLocationInput.value = ''; // Clear location input
    postFeelingSelect.value = ''; // Reset feeling select
    postFeelingCustom.style.display = 'none'; // Hide custom feeling input
    clearAllFiles(); // Clear all uploaded media files
  });

  loadPosts(); // Initial load of posts when the page is ready

  // Function to update user's favorite foods in their account data
  function updateUserFavorites(favoriteFoods) {
    try {
        // Get current user session
        const userSession = JSON.parse(localStorage.getItem('activeUserSession') || '{}');
        if (!userSession.userId) {
            console.log('No active user session found');
            return;
        }

        // Get all users from storage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Find the current user
        const userIndex = users.findIndex(user => user.email === userSession.userId);
        
        if (userIndex !== -1) {
            // Update the user's favoriteFoods
            users[userIndex].favoriteFoods = favoriteFoods;
            
            // Save back to localStorage
            localStorage.setItem('users', JSON.stringify(users));
            
            console.log('Updated user favorites for:', userSession.userId, favoriteFoods);
        } else {
            console.error('User not found in users array:', userSession.userId);
        }
    } catch (error) {
        console.error('Error updating user favorites:', error);
    }
  }
});
