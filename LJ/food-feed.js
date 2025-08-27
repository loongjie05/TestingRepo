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

  // --- Geoapify configuration ---
  const GEOAPIFY_API_KEY = '3cc1eb78093c4c35bfd3445bb50d8026';
  let geoapifyDropdown;
  let geoapifyAbortController;
  let geoapifyDebounceTimer;

  // --- Configuration ---
  const COMMENT_DISPLAY_LIMIT = 2; // Number of comments to show initially

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

  // --- Geolocation Functions (use Geoapify Reverse Geocoding) ---
  async function getUserLocation() {
    postLocationInput.value = 'Fetching location...';
    if (!navigator.geolocation) {
      postLocationInput.value = 'Geolocation not supported by this browser.';
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      try {
        const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&apiKey=${GEOAPIFY_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        const feature = data && data.features && data.features[0];
        const name = feature ? (feature.properties.formatted || feature.properties.city || feature.properties.name) : undefined;
        postLocationInput.value = name || `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`;
        // Save coordinates on the input for later use
        postLocationInput.dataset.lat = String(lat);
        postLocationInput.dataset.lon = String(lon);
      } catch (error) {
        console.error('Geoapify reverse geocoding error:', error);
        postLocationInput.value = `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`;
        postLocationInput.dataset.lat = String(lat);
        postLocationInput.dataset.lon = String(lon);
      }
    }, (error) => {
      console.error('Geolocation error:', error);
      postLocationInput.value = 'Location access denied or unavailable.';
    });
  }

  getLocationBtn.addEventListener('click', getUserLocation);

  // --- Geoapify Autocomplete (simple custom dropdown) ---
  function ensureDropdown() {
    if (geoapifyDropdown) return geoapifyDropdown;
    geoapifyDropdown = document.createElement('div');
    geoapifyDropdown.style.position = 'absolute';
    geoapifyDropdown.style.zIndex = '9999';
    geoapifyDropdown.style.background = '#fff';
    geoapifyDropdown.style.border = '1px solid #ddd';
    geoapifyDropdown.style.borderRadius = '6px';
    geoapifyDropdown.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
    geoapifyDropdown.style.padding = '6px 0';
    geoapifyDropdown.style.display = 'none';
    document.body.appendChild(geoapifyDropdown);
    return geoapifyDropdown;
  }

  function positionDropdown() {
    const rect = postLocationInput.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    geoapifyDropdown.style.top = `${rect.bottom + scrollTop + 4}px`;
    geoapifyDropdown.style.left = `${rect.left + scrollLeft}px`;
    geoapifyDropdown.style.width = `${rect.width}px`;
  }

  function hideDropdown() {
    if (geoapifyDropdown) geoapifyDropdown.style.display = 'none';
  }

  function showDropdown() {
    ensureDropdown();
    positionDropdown();
    geoapifyDropdown.style.display = 'block';
  }

  function clearDropdown() {
    if (!geoapifyDropdown) return;
    geoapifyDropdown.innerHTML = '';
  }

  function renderSuggestions(features) {
    clearDropdown();
    if (!features || !features.length) {
      hideDropdown();
      return;
    }
    features.forEach((f) => {
      const item = document.createElement('div');
      item.textContent = f.properties.formatted || f.properties.name;
      item.style.padding = '8px 12px';
      item.style.cursor = 'pointer';
      item.addEventListener('mouseover', () => item.style.background = '#f5f5f5');
      item.addEventListener('mouseout', () => item.style.background = 'transparent');
      item.addEventListener('click', () => {
        postLocationInput.value = f.properties.formatted || f.properties.name || '';
        postLocationInput.dataset.lat = String(f.properties.lat);
        postLocationInput.dataset.lon = String(f.properties.lon);
        hideDropdown();
      });
      geoapifyDropdown.appendChild(item);
    });
    showDropdown();
  }

  async function fetchGeoapifyAutocomplete(query) {
    if (geoapifyAbortController) geoapifyAbortController.abort();
    geoapifyAbortController = new AbortController();
    const signal = geoapifyAbortController.signal;
    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&limit=6&filter=countrycode:my&format=json&apiKey=${GEOAPIFY_API_KEY}`;
    try {
      const res = await fetch(url, { signal });
      const data = await res.json();
      // The /autocomplete endpoint returns features[] by default; format=json returns results[]
      const features = data.features || (data.results ? data.results.map(r => ({ properties: r })) : []);
      renderSuggestions(features);
    } catch (e) {
      if (e.name !== 'AbortError') {
        console.error('Geoapify autocomplete error:', e);
        hideDropdown();
      }
    }
  }

  postLocationInput.setAttribute('autocomplete', 'off');
  postLocationInput.addEventListener('input', (e) => {
    const text = e.target.value.trim();
    if (!text) { hideDropdown(); return; }
    ensureDropdown();
    positionDropdown();
    clearTimeout(geoapifyDebounceTimer);
    geoapifyDebounceTimer = setTimeout(() => fetchGeoapifyAutocomplete(text), 250);
  });

  window.addEventListener('resize', () => { if (geoapifyDropdown && geoapifyDropdown.style.display === 'block') positionDropdown(); });
  window.addEventListener('scroll', () => { if (geoapifyDropdown && geoapifyDropdown.style.display === 'block') positionDropdown(); }, true);
  document.addEventListener('click', (e) => {
    if (e.target === postLocationInput || (geoapifyDropdown && geoapifyDropdown.contains(e.target))) return;
    hideDropdown();
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
  function renderPost(post) {
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
      </div>
      <div class="post-actions">
        <button class="reaction-button post-like-button ${hasLiked ? 'liked' : ''}" data-action="like">
          <svg class="reaction-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <span class="reaction-count">${post.likes}</span>
        </button>
        <button class="reaction-button post-delete-button" data-action="delete" title="Delete post">🗑️ Delete</button>
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

    // Render comments for the post
    renderComments(postCard, post.id); 
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
    postsFeedContainer.innerHTML = ''; // Clear the feed before loading
    storedPosts.slice().reverse().forEach(post => renderPost(post)); // Show newest first
  }

  // --- Handle form submission ---
  createPostForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // This is crucial - it stops the page from reloading!

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
      locationLat: postLocationInput.dataset.lat ? Number(postLocationInput.dataset.lat) : undefined,
      locationLon: postLocationInput.dataset.lon ? Number(postLocationInput.dataset.lon) : undefined,
      feeling: (postFeelingSelect.value === 'custom' ? postFeelingCustom.value.trim() : postFeelingSelect.value)
    };

    const storedPosts = JSON.parse(localStorage.getItem('foodPosts')) || [];
    storedPosts.push(newPost);
    localStorage.setItem('foodPosts', JSON.stringify(storedPosts));

    renderPost(newPost); // Display the new post immediately
    createPostForm.reset(); // Clear the form fields
    postLocationInput.value = ''; // Clear location input
    postFeelingSelect.value = ''; // Reset feeling select
  });

  loadPosts(); // Initial load of posts when the page is ready
});
