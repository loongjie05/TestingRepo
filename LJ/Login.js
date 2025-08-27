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

  // --- Enhanced Password Validation ---
  function validatePassword(password) {
    const requirements = {
      length: password.length >= 8,
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password),
      number: /[0-9]+/.test(password),
      capital: /[A-Z]+/.test(password),
      lowercase: /[a-z]+/.test(password)
    };

    // Update visual feedback for requirements list
    if (requirementsElements.length) requirementsElements.length.classList.toggle('valid', requirements.length);
    if (requirementsElements.special) requirementsElements.special.classList.toggle('valid', requirements.special);
    if (requirementsElements.number) requirementsElements.number.classList.toggle('valid', requirements.number);
    if (requirementsElements.capital) requirementsElements.capital.classList.toggle('valid', requirements.capital);
    if (requirementsElements.lowercase) requirementsElements.lowercase.classList.toggle('valid', requirements.lowercase);

    // All requirements must be met for strongest level
    return Object.values(requirements).every(req => req === true);
  }

  function getPasswordStrength(password) {
    let score = 0;
    const requirements = {
      length: password.length >= 8,
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password),
      number: /[0-9]+/.test(password),
      capital: /[A-Z]+/.test(password),
      lowercase: /[a-z]+/.test(password)
    };

    // Calculate score
    Object.values(requirements).forEach(req => {
      if (req) score++;
    });

    // Bonus points for length
    if (password.length >= 12) score += 0.5;
    if (password.length >= 16) score += 0.5;

    return {
      score: score,
      level: score < 3 ? 'weak' : score < 4 ? 'medium' : score < 5 ? 'strong' : 'very-strong',
      requirements: requirements
    };
  }

  // --- Password Strength Indicator ---
  function updatePasswordStrength(password) {
    if (!strengthBar) return;
    
    const strength = getPasswordStrength(password);
    
    // Remove existing classes
    strengthBar.classList.remove('weak', 'medium', 'strong', 'very-strong');
    
    // Add appropriate class
    strengthBar.classList.add(strength.level);
    
    // Update strength text
    const strengthText = strengthBar.querySelector('.strength-text');
    if (strengthText) {
      strengthText.textContent = strength.level.charAt(0).toUpperCase() + strength.level.slice(1);
    }
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
  const signupForm = document.querySelector('.signup-form');
  const loginError = document.getElementById('login-error');
  const signupPasswordError = document.getElementById('signup-password-error');
  const signupEmailError = document.getElementById('signup-email-error');
  const signupSuccessMessage = document.getElementById('signup-success-message');

  const passwordInput = document.getElementById('signup-password');
  const emailInput = document.getElementById('signup-email');
  const strengthBar = document.getElementById('password-strength-bar');
  const requirementsElements = {
    length: document.getElementById('req-length'),
    special: document.getElementById('req-special'),
    number: document.getElementById('req-number'),
    capital: document.getElementById('req-capital'),
    lowercase: document.getElementById('req-lowercase')
  };
  const passwordRequirements = document.getElementById('password-requirements');

  // --- Sign Up Form Handler ---
  if (signupForm) {
    signupForm.addEventListener('submit', (event) => {
      event.preventDefault();
      
      const name = signupForm.querySelector('input[type="text"]').value.trim();
      const email = emailInput.value.trim();
      const password = passwordInput.value;

      // Clear previous error messages
      if (signupEmailError) signupEmailError.style.display = 'none';
      if (signupPasswordError) signupPasswordError.style.display = 'none';

      // Basic validation
      if (!name || !email || !password) {
        showAlert('Please fill in all fields', 'error');
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        if (signupEmailError) {
          signupEmailError.textContent = 'Please enter a valid email address.';
          signupEmailError.style.display = 'block';
        }
        return;
      }

      // Validate password strength - must be strongest level
      if (!validatePassword(password)) {
        if (signupPasswordError) {
          signupPasswordError.textContent = 'Password must meet ALL requirements for strongest level.';
          signupPasswordError.style.display = 'block';
        }
        showAlert('Password not strong enough! Please meet all requirements.', 'error');
        return;
      }

      // Check if email already exists
      const existingUsers = JSON.parse(getLocalStorage('users')) || [];
      const emailExists = existingUsers.some(user => user.email.toLowerCase() === email.toLowerCase());

      if (emailExists) {
        if (signupEmailError) {
          signupEmailError.textContent = 'Email already exists. Please use a different email.';
          signupEmailError.style.display = 'block';
        }
        return;
      }

      // Create new user with enhanced data
      const newUser = {
        id: Date.now(),
        name: name,
        firstName: name.split(' ')[0], // Extract first name
        email: email,
        password: password, // In production, this should be hashed
        createdAt: new Date().toISOString(),
        lastLogin: null,
        loginCount: 0
      };

      existingUsers.push(newUser);
      setLocalStorage('users', JSON.stringify(existingUsers));

      // Show success message
      if (signupSuccessMessage) {
        signupSuccessMessage.textContent = 'Account created successfully! Please log in.';
        signupSuccessMessage.style.display = 'block';
      }

      showAlert('Account created successfully!', 'success');

      // Clear form
      signupForm.reset();
      
      // Flip back to login after 2 seconds
      setTimeout(() => {
        if (signupSuccessMessage) signupSuccessMessage.style.display = 'none';
        document.getElementById('flip-toggle').checked = false;
      }, 2000);
    });
  }

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

  // --- Password Input Event Listeners ---
  if (passwordInput) {
    passwordInput.addEventListener('focus', () => {
      if (passwordRequirements) passwordRequirements.style.display = 'block';
      if (strengthBar && passwordInput.value.length > 0) {
        strengthBar.style.display = 'block';
      }
    });

    passwordInput.addEventListener('blur', () => {
      if (strengthBar) strengthBar.style.display = 'none';
      if (passwordRequirements) passwordRequirements.style.display = 'none';
    });

    passwordInput.addEventListener('input', () => {
      const password = passwordInput.value;
      
      if (strengthBar) {
        if (password.length > 0) {
          strengthBar.style.display = 'block';
        } else {
          strengthBar.style.display = 'none';
        }
      }

      validatePassword(password);
      updatePasswordStrength(password);
    });
  }

  // --- Email Input Event Listeners ---
  if (emailInput) {
    emailInput.addEventListener('input', () => {
      if (signupEmailError) signupEmailError.style.display = 'none';
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

  // --- Card Flip Animation Enhancement ---
  const flipToggle = document.getElementById('flip-toggle');
  if (flipToggle) {
    flipToggle.addEventListener('change', () => {
      // Clear any error messages when flipping
      if (loginError) loginError.style.display = 'none';
      if (signupEmailError) signupEmailError.style.display = 'none';
      if (signupPasswordError) signupPasswordError.style.display = 'none';
      if (signupSuccessMessage) signupSuccessMessage.style.display = 'none';
      
      // Reset forms
      if (loginForm) loginForm.reset();
      if (signupForm) signupForm.reset();
      
      // Clear password strength indicator
      if (strengthBar) {
        strengthBar.classList.remove('weak', 'medium', 'strong', 'very-strong');
        strengthBar.style.display = 'none';
      }
      
      // Reset requirements
      Object.values(requirementsElements).forEach(req => {
        if (req) req.classList.remove('valid');
      });
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

  if (signupForm) {
    const signupButton = signupForm.querySelector('.button');
    if (signupButton) {
      signupForm.addEventListener('submit', () => {
        setButtonLoading(signupButton, true);
        setTimeout(() => setButtonLoading(signupButton, false), 2000);
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
