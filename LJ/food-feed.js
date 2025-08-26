document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Element Selection ---
  const createPostForm = document.getElementById('create-post-form');
  const foodNameInput = document.getElementById('food-name');
  const postContentInput = document.getElementById('post-content');
  const postsFeedContainer = document.getElementById('posts-feed');

  // --- Configuration ---
  const COMMENT_DISPLAY_LIMIT = 2; // Changed from 3 to 2

  // --- Helper to get current user's name (from login cookie) ---
  function getCurrentUser() {
    // In a real app, you'd get this from a session or a dedicated 'currentUser' cookie set upon login.
    // For this demo, we'll just find the first user in your cookie.
    const usersCookie = getCookie('users');
    if (usersCookie) {
        const users = JSON.parse(usersCookie);
        if (users.length > 0) {
            return users[0].name; // Using the first user's name as the author
        }
    }
    return "A Food Lover"; // Fallback name if no user is found
  }

  // --- Cookie Helper (needed for getCurrentUser) ---
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
      </div>
    `;

    commentListContainer.appendChild(commentElement);

    commentElement.querySelector('.comment-like-button').addEventListener('click', (event) => handleCommentLikeDislike(event, postId, comment.id));
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

    // Determine if the current user has liked the post
    const currentUser = getCurrentUser();
    const hasLiked = post.likedBy && post.likedBy.includes(currentUser);

    // This HTML structure matches your food-feed.css styles
    postCard.innerHTML = `
      <div class="post-header">
        <span class="post-author">${post.author}</span>
        <span class="post-date">${postDate}</span>
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
      </div>
      <div class="comments-section">
        <!-- Comments will be dynamically inserted here by renderComments function -->
      </div>
    `;

    // Add the new post to the top of the feed
    postsFeedContainer.prepend(postCard);

    // Add event listener for the post like button
    postCard.querySelector('.post-like-button').addEventListener('click', handleLikeClick);

    // Render comments for the post
    renderComments(postCard, post.id); // Updated call to renderComments, removed 'post.comments' argument
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
        renderComments(postCard, postId); // Updated call to renderComments, removed 'comments' argument
        
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

  // --- Load existing posts from localStorage on page load ---
  function loadPosts() {
    const storedPosts = JSON.parse(localStorage.getItem('foodPosts')) || [];
    postsFeedContainer.innerHTML = ''; // Clear the feed before loading
    storedPosts.slice().reverse().forEach(post => renderPost(post)); // Show newest first
  }

  // --- Handle form submission ---
  createPostForm.addEventListener('submit', (event) => {
    event.preventDefault(); // This is crucial - it stops the page from reloading!

    const newPost = {
      id: Date.now(), // Simple unique ID using the current timestamp
      author: getCurrentUser(),
      foodName: foodNameInput.value.trim(),
      content: postContentInput.value.trim(),
      timestamp: new Date().toISOString(),
      likes: 0,
      likedBy: [], // Track users who liked this post
      comments: [] // Initialize comments array for new posts
    };

    const storedPosts = JSON.parse(localStorage.getItem('foodPosts')) || [];
    storedPosts.push(newPost);
    localStorage.setItem('foodPosts', JSON.stringify(storedPosts));

    renderPost(newPost); // Display the new post immediately
    createPostForm.reset(); // Clear the form fields
  });

  loadPosts(); // Initial load of posts when the page is ready
});