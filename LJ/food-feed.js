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
        <button class="like-button">
          <span class="like-icon">❤️</span>
          <span class="like-count">${post.likes}</span>
        </button>
      </div>
      <div class="comments-section">
        <!-- Comments can be added here later -->
      </div>
    `;

    // Add the new post to the top of the feed
    postsFeedContainer.prepend(postCard);

    // Add event listener for the new like button
    postCard.querySelector('.like-button').addEventListener('click', handleLikeClick);
  }

  // --- Handle Like Button Click ---
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
      comments: []
    };

    const storedPosts = JSON.parse(localStorage.getItem('foodPosts')) || [];
    storedPosts.push(newPost);
    localStorage.setItem('foodPosts', JSON.stringify(storedPosts));

    renderPost(newPost); // Display the new post immediately
    createPostForm.reset(); // Clear the form fields
  });

  loadPosts(); // Initial load of posts when the page is ready
});
