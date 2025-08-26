document.addEventListener('DOMContentLoaded', () => {
  // --- LocalStorage Helper Functions ---
  function setLocalStorage(name, value) {
    localStorage.setItem(name, value);
  }

  function getLocalStorage(name) {
    return localStorage.getItem(name);
  }

  // --- Custom Alert Function ---
  function showAlert(message, type = 'success') {
    const alert = document.getElementById('custom-alert');
    const alertMessage = document.getElementById('custom-alert-message');
    
    alert.className = `custom-alert-${type}`;
    alertMessage.textContent = message;
    alert.classList.add('custom-alert-show');
    
    setTimeout(() => {
      alert.classList.remove('custom-alert-show');
    }, 3000);
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
  const requirements = {
    length: document.getElementById('req-length'),
    special: document.getElementById('req-special'),
    number: document.getElementById('req-number'),
    capital: document.getElementById('req-capital')
  };
  const passwordRequirements = document.getElementById('password-requirements');

  const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/; 
  const numbers = /[0-9]+/; 
  const capitalLetters = /[A-Z]+/; 

  // --- Password Validation Function ---
  function validatePassword(password) {
    const lengthValid = password.length >= 8;
    const specialValid = specialChars.test(password);
    const numberValid = numbers.test(password);
    const capitalValid = capitalLetters.test(password);

    // Update visual feedback for requirements list
    if (requirements.length) requirements.length.classList.toggle('valid', lengthValid);
    if (requirements.special) requirements.special.classList.toggle('valid', specialValid);
    if (requirements.number) requirements.number.classList.toggle('valid', numberValid);
    if (requirements.capital) requirements.capital.classList.toggle('valid', capitalValid);

    return lengthValid && specialValid && numberValid && capitalValid;
  }

  // --- Password Strength Indicator ---
  function updatePasswordStrength(password) {
    if (!strengthBar) return;
    
    let strength = 0;
    const lengthValid = password.length >= 8;
    const specialValid = specialChars.test(password);
    const numberValid = numbers.test(password);
    const capitalValid = capitalLetters.test(password);

    if (lengthValid) strength++;
    if (specialValid) strength++;
    if (numberValid) strength++;
    if (capitalValid) strength++;

    // Remove existing classes
    strengthBar.classList.remove('weak', 'medium', 'strong', 'very-strong');
    
    // Add appropriate class
    if (strength <= 1) {
      strengthBar.classList.add('weak');
    } else if (strength <= 2) {
      strengthBar.classList.add('medium');
    } else if (strength <= 3) {
      strengthBar.classList.add('strong');
    } else {
      strengthBar.classList.add('very-strong');
    }
  }

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

      // Validate password strength
      if (!validatePassword(password)) {
        if (signupPasswordError) {
          signupPasswordError.textContent = 'Password does not meet all requirements.';
          signupPasswordError.style.display = 'block';
        }
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

      // Create new user
      const newUser = {
        name,
        email,
        password,
        createdAt: new Date().toISOString()
      };

      existingUsers.push(newUser);
      setLocalStorage('users', JSON.stringify(existingUsers));

      // Show success message
      if (signupSuccessMessage) {
        signupSuccessMessage.textContent = 'Account created successfully! Please log in.';
        signupSuccessMessage.style.display = 'block';
      }

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
        // Set active session
        setLocalStorage('activeUserSession', user.name);
        setLocalStorage('userEmail', user.email);
        
        // Show success message
        showAlert(`Welcome back, ${user.name}!`, 'success');
        
        // Redirect to homepage after a short delay
        setTimeout(() => {
          window.location.href = '../JH/Homepage.html';
        }, 1000);
      } else {
        if (loginError) {
          loginError.textContent = 'Invalid email or password.';
          loginError.style.display = 'block';
        }
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
  console.log('Login page initialized successfully');
});
