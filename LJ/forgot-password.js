document.addEventListener('DOMContentLoaded', () => {
  // --- Cookie Helper Functions (copied from Login.js) ---
  function setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

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

  // --- Raining Food Animation (copied from Login.js) ---
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

  setInterval(createFoodPicture, 300);

  // --- Forgot Password Logic ---
  const emailStep = document.getElementById('email-step');
  const resetStep = document.getElementById('reset-step');
  const forgotPasswordForm = document.getElementById('forgot-password-form');
  const resetPasswordForm = document.getElementById('reset-password-form');
  const emailInput = document.getElementById('email-input');
  const newPasswordInput = document.getElementById('new-password-input');
  const emailError = document.getElementById('email-error');
  const resetSuccessMessage = document.getElementById('reset-success-message');

  let emailToReset = null;

  forgotPasswordForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = emailInput.value;
    const existingUsers = JSON.parse(getCookie('users')) || [];
    const userExists = existingUsers.some(user => user.email.toLowerCase() === email.toLowerCase());

    if (userExists) {
      emailToReset = email;
      emailStep.style.display = 'none';
      resetStep.style.display = 'block';
      emailError.style.display = 'none';
    } else {
      emailError.textContent = 'No account found with that email address.';
      emailError.style.display = 'block';
    }
  });

  resetPasswordForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const newPassword = newPasswordInput.value;
    
    if (!emailToReset) return; // Should not happen in normal flow

    let existingUsers = JSON.parse(getCookie('users')) || [];
    
    const userIndex = existingUsers.findIndex(user => user.email.toLowerCase() === emailToReset.toLowerCase());
    if (userIndex !== -1) {
      existingUsers[userIndex].password = newPassword;
      setCookie('users', JSON.stringify(existingUsers), 7);

      resetStep.style.display = 'none';
      resetSuccessMessage.textContent = 'Password has been reset successfully! Redirecting to login...';
      resetSuccessMessage.style.display = 'block';

      setTimeout(() => {
        window.location.href = 'Login.html';
      }, 3000);
    }
  });
});
