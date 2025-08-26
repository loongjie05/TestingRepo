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
    'pictures/Burger.png', 'pictures/NasiLemak.png', 'pictures/Ramen.png',
    'pictures/pasta.png', 'pictures/Taco.png', 'pictures/Fries.png',
    'pictures/Satay.png', 'pictures/Pancake.png', 'pictures/Sushi.png',
    'pictures/RotiCanai.png', 'pictures/mee.png', 'pictures/ChickenRice.png',
    'pictures/BakKutTeh.png'
  ];

  function animateFoodPicture(img) {
    const animationDuration = Math.random() * 5 + 8;
    requestAnimationFrame(() => {
      img.style.transition = `transform ${animationDuration}s linear, opacity ${animationDuration}s linear`;
      img.style.transform = `translateY(${window.innerHeight + 150}px)`;
      img.style.opacity = '0';
    });
    img.addEventListener('transitionend', () => img.remove(), { once: true });
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
  const resetForm = document.getElementById('reset-form');
  const emailInput = document.getElementById('reset-email');
  const newPasswordInput = document.getElementById('new-password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const messageEl = document.getElementById('reset-message');

  // --- Password Strength Logic ---
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

  // --- Password Input Event Listeners ---
  if (newPasswordInput) {
    newPasswordInput.addEventListener('focus', () => {
      if (passwordRequirements) passwordRequirements.style.display = 'block';
      if (strengthBar && newPasswordInput.value.length > 0) {
        strengthBar.style.display = 'block';
      }
    });

    newPasswordInput.addEventListener('blur', () => {
      if (strengthBar) strengthBar.style.display = 'none';
      if (passwordRequirements) passwordRequirements.style.display = 'none';
    });

    newPasswordInput.addEventListener('input', () => {
      const password = newPasswordInput.value;
      
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

  // --- Form Submission Logic ---
  if (resetForm) {
    resetForm.addEventListener('submit', (event) => {
      event.preventDefault();
      
      const email = emailInput.value.trim();
      const newPassword = newPasswordInput.value;
      const confirmPassword = confirmPasswordInput.value;

      // Clear previous message
      if (messageEl) messageEl.style.display = 'none';

      // Basic validation
      if (!email || !newPassword || !confirmPassword) {
        showAlert('Please fill in all fields', 'error');
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        if (messageEl) {
          messageEl.textContent = 'Please enter a valid email address.';
          messageEl.style.display = 'block';
        }
        return;
      }

      // Check if passwords match
      if (newPassword !== confirmPassword) {
        if (messageEl) {
          messageEl.textContent = 'Passwords do not match.';
          messageEl.style.display = 'block';
        }
        return;
      }

      // Validate password strength
      if (!validatePassword(newPassword)) {
        if (messageEl) {
          messageEl.textContent = 'Password does not meet all requirements.';
          messageEl.style.display = 'block';
        }
        return;
      }

      // Get existing users from localStorage
      const existingUsers = JSON.parse(getLocalStorage('users')) || [];
      
      if (existingUsers.length === 0) {
        if (messageEl) {
          messageEl.textContent = 'No user data found.';
          messageEl.style.display = 'block';
        }
        return;
      }

      // Find user by email
      const userIndex = existingUsers.findIndex(user => 
        user.email.toLowerCase() === email.toLowerCase()
      );

      if (userIndex === -1) {
        if (messageEl) {
          messageEl.textContent = 'Email not found. Please check and try again.';
          messageEl.style.display = 'block';
        }
        return;
      }

      // Check if new password is same as old password
      if (existingUsers[userIndex].password === newPassword) {
        if (messageEl) {
          messageEl.textContent = 'New password cannot be the same as the old password.';
          messageEl.style.display = 'block';
        }
        return;
      }

      // Update password
      existingUsers[userIndex].password = newPassword;
      existingUsers[userIndex].updatedAt = new Date().toISOString();
      
      // Save updated users
      setLocalStorage('users', JSON.stringify(existingUsers));

      // Show success message
      showAlert('Password reset successfully!', 'success');
      
      if (messageEl) {
        messageEl.textContent = 'Password reset successfully! Redirecting to login...';
        messageEl.style.display = 'block';
      }

      // Clear form
      resetForm.reset();
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        window.location.href = 'Login.html';
      }, 2000);
    });
  }

  // --- Input Event Listeners for Error Clearing ---
  if (emailInput) {
    emailInput.addEventListener('input', () => {
      if (messageEl) messageEl.style.display = 'none';
    });
  }

  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener('input', () => {
      if (messageEl) messageEl.style.display = 'none';
    });
  }

  // --- Loading State for Button ---
  function setButtonLoading(button, isLoading) {
    if (isLoading) {
      button.classList.add('loading');
      button.disabled = true;
    } else {
      button.classList.remove('loading');
      button.disabled = false;
    }
  }

  // --- Enhanced Form Submission with Loading State ---
  if (resetForm) {
    const resetButton = resetForm.querySelector('.button');
    if (resetButton) {
      resetForm.addEventListener('submit', () => {
        setButtonLoading(resetButton, true);
        setTimeout(() => setButtonLoading(resetButton, false), 2000);
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
  console.log('Forgot password page initialized successfully');
});