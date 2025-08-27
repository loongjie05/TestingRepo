document.addEventListener('DOMContentLoaded', () => {
  // --- Storage Helper Functions ---
  
  // Local Storage Functions
  function setLocalStorage(name, value) {
    try {
      localStorage.setItem(name, value);
    } catch (e) {
      console.error('LocalStorage error:', e);
    }
  }

  function getLocalStorage(name) {
    try {
      return localStorage.getItem(name);
    } catch (e) {
      console.error('LocalStorage error:', e);
      return null;
    }
  }

  function removeLocalStorage(name) {
    try {
      localStorage.removeItem(name);
    } catch (e) {
      console.error('LocalStorage error:', e);
    }
  }

  // Session Storage Functions
  function setSessionStorage(name, value) {
    try {
      sessionStorage.setItem(name, value);
    } catch (e) {
      console.error('SessionStorage error:', e);
    }
  }

  function getSessionStorage(name) {
    try {
      return sessionStorage.getItem(name);
    } catch (e) {
      console.error('SessionStorage error:', e);
      return null;
    }
  }

  function removeSessionStorage(name) {
    try {
      sessionStorage.removeItem(name);
    } catch (e) {
      console.error('SessionStorage error:', e);
    }
  }

  // Cookie Functions
  function setCookie(name, value, days = 30) {
    try {
      const expires = new Date();
      expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
    } catch (e) {
      console.error('Cookie error:', e);
    }
  }

  function getCookie(name) {
    try {
      const nameEQ = name + "=";
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    } catch (e) {
      console.error('Cookie error:', e);
      return null;
    }
  }

  function removeCookie(name) {
    try {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    } catch (e) {
      console.error('Cookie error:', e);
    }
  }

  // --- User Session Management ---
  function createUserSession(user) {
    const sessionData = {
      id: Date.now(),
      userId: user.email,
      userName: user.name,
      loginTime: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };

    // Store in multiple storage types for redundancy
    setLocalStorage('activeUserSession', JSON.stringify(sessionData));
    setSessionStorage('currentUser', JSON.stringify(sessionData));
    setCookie('userSession', JSON.stringify(sessionData), 7); // 7 days
    
    // Update global user state
    window.currentUser = sessionData;
    
    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('userLogin', { detail: sessionData }));
  }

  function clearUserSession() {
    removeLocalStorage('activeUserSession');
    removeSessionStorage('currentUser');
    removeCookie('userSession');
    window.currentUser = null;
    
    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('userLogout'));
  }

  function updateUserActivity() {
    const user = getCurrentUser();
    if (user) {
      user.lastActivity = new Date().toISOString();
      createUserSession(user);
    }
  }

  function getCurrentUser() {
    // Try to get user from multiple sources
    let user = null;
    
    // Try localStorage first
    const localUser = getLocalStorage('activeUserSession');
    if (localUser) {
      try {
        user = JSON.parse(localUser);
      } catch (e) {
        console.error('Error parsing localStorage user:', e);
      }
    }
    
    // If no local user, try session storage
    if (!user) {
      const sessionUser = getSessionStorage('currentUser');
      if (sessionUser) {
        try {
          user = JSON.parse(sessionUser);
        } catch (e) {
          console.error('Error parsing sessionStorage user:', e);
        }
      }
    }
    
    // If no session user, try cookies
    if (!user) {
      const cookieUser = getCookie('userSession');
      if (cookieUser) {
        try {
          user = JSON.parse(cookieUser);
        } catch (e) {
          console.error('Error parsing cookie user:', e);
        }
      }
    }
    
    return user;
  }



  // --- Custom Alert Function ---
  function showAlert(message, type = 'success') {
    const alert = document.getElementById('custom-alert');
    const alertMessage = document.getElementById('custom-alert-message');
    
    if (alert && alertMessage) {
      alert.className = `custom-alert-${type}`;
      alertMessage.textContent = message;
      alert.classList.add('custom-alert-show');
      
      setTimeout(() => {
        alert.classList.remove('custom-alert-show');
      }, 3000);
    }
  }

  // --- Raining Food Animation ---
  const foodPictures = [
    'pictures/Burger.png',
    'pictures/NasiLemak.png',
    'pictures/Ramen.png',
    'pictures/pasta.png',
    'pictures/Taco.png',
    'pictures/Fries.png',
    'pictures/Satay.png',
    'pictures/Pancake.png',
    'pictures/Sushi.png',
    'pictures/RotiCanai.png',
    'pictures/mee.png',
    'pictures/ChickenRice.png',
    'pictures/BakKutTeh.png'
  ];

  function animateFoodPicture(img) {
    const animationDuration = Math.random() * 5 + 8;
    requestAnimationFrame(() => {
      img.style.transition = `transform ${animationDuration}s linear, opacity ${animationDuration}s linear`;
      img.style.transform = `translateY(${window.innerHeight + 150}px)`;
      img.style.opacity = '0';
    });

    img.addEventListener('transitionend', () => {
      img.remove();
    }, { once: true });
  }

  function createFoodPicture() {
    const rainContainer = document.getElementById('rain-container');
    if (!rainContainer) return;
    
    const img = document.createElement('img');
    img.classList.add('food-picture');
    img.src = foodPictures[Math.floor(Math.random() * foodPictures.length)];
    
    img.style.position = 'absolute';
    img.style.left = `${Math.random() * 100}vw`;
    img.style.top = '-150px';
    img.style.width = `${Math.random() * 30 + 20}px`;
    img.style.opacity = '1';
    img.style.transform = 'translateY(0px)';
    img.style.willChange = 'transform, opacity';

    rainContainer.appendChild(img);
    animateFoodPicture(img);
  }

  // Start the raining food animation
  setInterval(createFoodPicture, 300);

  // --- Form Elements ---
  const loginForm = document.querySelector('.login-form');
  const loginError = document.getElementById('login-error');



  // --- Login Form Handler ---
  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      
      const email = loginForm.querySelector('input[type="email"]').value.trim();
      const password = loginForm.querySelector('input[type="password"]').value;

      if (!email || !password) {
        showAlert('Please fill in all fields', 'error');
        return;
      }

      const existingUsers = JSON.parse(getLocalStorage('users')) || [];
      const user = existingUsers.find(user => 
        user.email.toLowerCase() === email.toLowerCase() && user.password === password
      );

      if (user) {
        // Update user login stats
        user.lastLogin = new Date().toISOString();
        user.loginCount = (user.loginCount || 0) + 1;
        
        // Update users in storage
        const userIndex = existingUsers.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
          existingUsers[userIndex] = user;
          setLocalStorage('users', JSON.stringify(existingUsers));
        }

        // Create user session
        createUserSession(user);

        // Migrate old favorites if they exist and user has no favoriteFoods yet
        const oldFavorites = JSON.parse(getLocalStorage('favourites') || '[]');
        if (oldFavorites.length > 0 && (!user.favoriteFoods || user.favoriteFoods.length === 0)) {
          user.favoriteFoods = oldFavorites;
          // Update user in storage with migrated favorites
          const userIndex = existingUsers.findIndex(u => u.id === user.id);
          if (userIndex !== -1) {
            existingUsers[userIndex] = user;
            setLocalStorage('users', JSON.stringify(existingUsers));
          }
        }

        // Store favoriteFoods in localStorage
        setLocalStorage('favoriteFoods', JSON.stringify(user.favoriteFoods || []));
        
        // Show success message
        showAlert(`Welcome back, ${user.firstName || user.name}!`, 'success');
        
        // Redirect to homepage after a short delay
        setTimeout(() => {
          window.location.href = '../JH/Homepage.html';
        }, 1000);
      } else {
        if (loginError) {
          loginError.textContent = 'Invalid email or password.';
          loginError.style.display = 'block';
        }
        showAlert('Invalid email or password.', 'error');
      }
    });
  }



  // --- Form Input Event Listeners for Login ---
  const loginEmailInput = loginForm?.querySelector('input[type="email"]');
  const loginPasswordInput = loginForm?.querySelector('input[type="password"]');

  if (loginEmailInput) {
    loginEmailInput.addEventListener('input', () => {
      if (loginError) loginError.style.display = 'none';
    });
  }

  if (loginPasswordInput) {
    loginPasswordInput.addEventListener('input', () => {
      if (loginError) loginError.style.display = 'none';
    });
  }



  // --- Loading State for Buttons ---
  function setButtonLoading(button, isLoading) {
    if (isLoading) {
      button.classList.add('loading');
      button.disabled = true;
    } else {
      button.classList.remove('loading');
      button.disabled = false;
    }
  }

  // --- Enhanced Form Submission with Loading States ---
  if (loginForm) {
    const loginButton = loginForm.querySelector('.button');
    if (loginButton) {
      loginForm.addEventListener('submit', () => {
        setButtonLoading(loginButton, true);
        setTimeout(() => setButtonLoading(loginButton, false), 2000);
      });
    }
  }

  // --- Keyboard Navigation ---
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const activeElement = document.activeElement;
      if (activeElement && activeElement.tagName === 'INPUT') {
        const form = activeElement.closest('form');
        if (form) {
          event.preventDefault();
          form.dispatchEvent(new Event('submit'));
        }
      }
    }
  });

  // --- User Activity Tracking ---
  let activityTimer;
  function resetActivityTimer() {
    clearTimeout(activityTimer);
    activityTimer = setTimeout(() => {
      updateUserActivity();
    }, 300000); // 5 minutes
  }

  // Track user activity
  ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
    document.addEventListener(event, resetActivityTimer, true);
  });

  // --- Session Management ---
  function checkSessionValidity() {
    const user = getCurrentUser();
    if (user) {
      const lastActivity = new Date(user.lastActivity);
      const now = new Date();
      const timeDiff = now - lastActivity;
      
      // Session expires after 30 minutes of inactivity
      if (timeDiff > 30 * 60 * 1000) {
        clearUserSession();
        showAlert('Session expired due to inactivity. Please log in again.', 'error');
        return false;
      }
      
      // Update activity
      updateUserActivity();
      return true;
    }
    return false;
  }

  // Check session validity every minute
  setInterval(checkSessionValidity, 60000);

  // --- Accessibility Improvements ---
  // Add ARIA labels and roles
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    if (!input.getAttribute('aria-label')) {
      const label = input.closest('.form-group')?.querySelector('label');
      if (label) {
        input.setAttribute('aria-label', label.textContent);
      }
    }
  });

  // --- Initialize ---
  console.log('Enhanced Login page initialized successfully');
  
  // Check if user is already logged in
  const currentUser = getCurrentUser();
  if (currentUser) {
    console.log('User already logged in:', currentUser.userName);
    // Redirect to homepage if already logged in
    setTimeout(() => {
      window.location.href = '../JH/Homepage.html';
    }, 1000);
  }
});
