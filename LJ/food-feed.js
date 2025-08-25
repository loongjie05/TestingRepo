document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Element Selection ---
  const createPostForm = document.getElementById('create-post-form');
  const foodNameInput = document.getElementById('food-name');
  const postContentInput = document.getElementById('post-content');
  const postsFeedContainer = document.getElementById('posts-feed');

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

    commentElement.innerHTML = `
      <span class="comment-author">${comment.author}:</span>
      <span>${comment.content}</span>
      <div class="comment-actions">
        <button class="comment-like-button" data-action="like">👍 <span>${comment.likes}</span></button>
        <button class="comment-dislike-button" data-action="dislike">👎 <span>${comment.dislikes}</span></button>
      </div>
    `;

    commentListContainer.appendChild(commentElement);

    commentElement.querySelector('.comment-like-button').addEventListener('click', (event) => handleCommentLikeDislike(event, postId, comment.id));
    commentElement.querySelector('.comment-dislike-button').addEventListener('click', (event) => handleCommentLikeDislike(event, postId, comment.id));
  }

  // --- Function to render all comments for a post ---
  function renderComments(postCard, comments, postId) {
    const commentsSection = postCard.querySelector('.comments-section');
    commentsSection.innerHTML = `
      <h4>Comments</h4>
      <div class="comment-list"></div>
      <form class="add-comment-form">
        <input type="text" placeholder="Add a comment..." required>
        <button type="submit">Comment</button>
      </form>
    `;
    const commentListContainer = commentsSection.querySelector('.comment-list');
    comments.forEach(comment => renderComment(commentListContainer, comment, postId));

    // Add event listener for the comment form
    commentsSection.querySelector('.add-comment-form').addEventListener('submit', (event) => handleAddComment(event, postId));
  }


  // --- Function to render a single post ---
  function renderPost(post) {
    const postCard = document.createElement('div');
    postCard.classList.add('post-card');
    postCard.dataset.postId = post.id; // Use a unique ID for each post

    const postDate = new Date(post.timestamp).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

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
        <button class="like-button ${post.liked ? 'liked' : ''}">
          <span class="like-icon">❤️</span>
          <span class="like-count">${post.likes}</span>
        </button>
      </div>
      <div class="comments-section">
        <!-- Comments will be dynamically inserted here by renderComments function -->
      </div>
    `;

    // Add the new post to the top of the feed
    postsFeedContainer.prepend(postCard);

    // Add event listener for the post like button
    postCard.querySelector('.like-button').addEventListener('click', handleLikeClick);

    // Render comments for the post
    renderComments(postCard, post.comments, post.id);
  }

  // --- Handle Like Button Click for posts ---
  function handleLikeClick(event) {
    const likeButton = event.currentTarget;
    const postCard = likeButton.closest('.post-card');
    const postId = postCard.dataset.postId;

    const storedPosts = JSON.parse(localStorage.getItem('foodPosts')) || [];
    const postIndex = storedPosts.findIndex(p => p.id == postId);

    if (postIndex > -1) {
      // Toggle like status and update count
      storedPosts[postIndex].liked = !storedPosts[postIndex].liked;
      storedPosts[postIndex].likes += storedPosts[postIndex].liked ? 1 : -1;
      
      localStorage.setItem('foodPosts', JSON.stringify(storedPosts));
      likeButton.querySelector('.like-count').textContent = storedPosts[postIndex].likes;
      likeButton.classList.toggle('liked', storedPosts[postIndex].liked);
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
        dislikes: 0,
        likedBy: [], // To track users who liked this comment
        dislikedBy: [] // To track users who disliked this comment
      };

      const storedPosts = JSON.parse(localStorage.getItem('foodPosts')) || [];
      const postIndex = storedPosts.findIndex(p => p.id == postId);

      if (postIndex > -1) {
        storedPosts[postIndex].comments.push(newComment);
        localStorage.setItem('foodPosts', JSON.stringify(storedPosts));

        const commentListContainer = event.target.closest('.comments-section').querySelector('.comment-list');
        renderComment(commentListContainer, newComment, postId);
        commentInput.value = ''; // Clear the comment input
      }
    }
  }

  // --- Handle Comment Like/Dislike ---
  function handleCommentLikeDislike(event, postId, commentId) {
    const action = event.currentTarget.dataset.action; // 'like' or 'dislike'
    const currentUser = getCurrentUser(); // Get current user for tracking
    
    const storedPosts = JSON.parse(localStorage.getItem('foodPosts')) || [];
    const postIndex = storedPosts.findIndex(p => p.id == postId);

    if (postIndex > -1) {
      const commentIndex = storedPosts[postIndex].comments.findIndex(c => c.id == commentId);

      if (commentIndex > -1) {
        const comment = storedPosts[postIndex].comments[commentIndex];

        let likedBy = comment.likedBy || [];
        let dislikedBy = comment.dislikedBy || [];
        
        const userLiked = likedBy.includes(currentUser);
        const userDisliked = dislikedBy.includes(currentUser);

        if (action === 'like') {
          if (userLiked) {
            // User already liked, so unlike
            comment.likes--;
            likedBy = likedBy.filter(user => user !== currentUser);
          } else {
            // User likes
            comment.likes++;
            likedBy.push(currentUser);
            if (userDisliked) {
              // If user previously disliked, remove dislike
              comment.dislikes--;
              dislikedBy = dislikedBy.filter(user => user !== currentUser);
            }
          }
        } else if (action === 'dislike') {
          if (userDisliked) {
            // User already disliked, so undislike
            comment.dislikes--;
            dislikedBy = dislikedBy.filter(user => user !== currentUser);
          } else {
            // User dislikes
            comment.dislikes++;
            dislikedBy.push(currentUser);
            if (userLiked) {
              // If user previously liked, remove like
              comment.likes--;
              likedBy = likedBy.filter(user => user !== currentUser);
            }
          }
        }

        comment.likedBy = likedBy;
        comment.dislikedBy = dislikedBy;

        localStorage.setItem('foodPosts', JSON.stringify(storedPosts));

        // Update the UI for the specific comment
        const commentElement = event.currentTarget.closest('.comment');
        commentElement.querySelector('.comment-like-button span').textContent = comment.likes;
        commentElement.querySelector('.comment-dislike-button span').textContent = comment.dislikes;
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
      liked: false, // Track if the current user has liked this post
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
