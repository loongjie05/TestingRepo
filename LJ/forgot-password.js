document.addEventListener('DOMContentLoaded', () => {
  // --- Cookie Helper Functions (Copied from Login.js) ---
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

  // --- Raining Food Animation (Copied from Login.js for consistent background) ---
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

  setInterval(createFoodPicture, 300);

  // --- Password Reset Logic ---
  const resetForm = document.getElementById('reset-form');
  const emailInput = document.getElementById('reset-email');
  const newPasswordInput = document.getElementById('new-password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const messageEl = document.getElementById('reset-message');

  // --- Password Strength Logic (from Login.js) ---
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

  newPasswordInput.addEventListener('focus', () => {
    passwordRequirements.style.display = 'block';
    if (newPasswordInput.value.length > 0) strengthBar.style.display = 'block';
  });

  newPasswordInput.addEventListener('blur', () => {
    strengthBar.style.display = 'none';
    passwordRequirements.style.display = 'none';
  });

  newPasswordInput.addEventListener('input', () => {
    const password = newPasswordInput.value;
    strengthBar.style.display = password.length > 0 ? 'block' : 'none';

    let strength = 0;
    const lengthValid = password.length >= 8;
    const specialValid = specialChars.test(password);
    const numberValid = numbers.test(password);
    const capitalValid = capitalLetters.test(password);

    if (lengthValid) strength++;
    if (specialValid) strength++;
    if (numberValid) strength++;
    if (capitalValid) strength++;

    strengthBar.style.setProperty('--clr', strength <= 1 ? 'red' : strength <= 3 ? 'orange' : 'green');
    strengthBar.style.width = `${(strength / 4) * 100}%`;

    Object.keys(requirements).forEach(key => requirements[key].classList.remove('valid'));
    if (lengthValid) requirements.length.classList.add('valid');
    if (specialValid) requirements.special.classList.add('valid');
    if (numberValid) requirements.number.classList.add('valid');
    if (capitalValid) requirements.capital.classList.add('valid');
  });

  // --- Form Submission Logic ---
  resetForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = emailInput.value;
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (newPassword !== confirmPassword) {
      messageEl.textContent = 'Passwords do not match.';
      messageEl.style.color = 'red';
      messageEl.style.display = 'block';
      return;
    }

    const usersCookie = getCookie('users');
    if (!usersCookie) {
      messageEl.textContent = 'No user data found.';
      messageEl.style.color = 'red';
      messageEl.style.display = 'block';
      return;
    }

    const existingUsers = JSON.parse(usersCookie);
    const userIndex = existingUsers.findIndex(user => {
      const storedEmail = user.email;
      const enteredEmail = email;
      const firstCharMatch = storedEmail.charAt(0).toLowerCase() === enteredEmail.charAt(0).toLowerCase();
      const restOfEmailMatch = storedEmail.substring(1) === enteredEmail.substring(1);
      return firstCharMatch && restOfEmailMatch;
    });

    if (userIndex !== -1) {
      if (existingUsers[userIndex].password === newPassword) {
        messageEl.textContent = 'New password cannot be the same as the old password.';
        messageEl.style.color = 'red';
        messageEl.style.display = 'block';
        return;
      }

      existingUsers[userIndex].password = newPassword;
      setCookie('users', JSON.stringify(existingUsers), 7);
      messageEl.textContent = 'Password reset successfully! Redirecting to login...';
      messageEl.style.color = 'green';
      messageEl.style.display = 'block';
      setTimeout(() => { window.location.href = 'Login.html'; }, 2000);
    } else {
      messageEl.textContent = 'Email not found. Please check and try again.';
      messageEl.style.color = 'red';
      messageEl.style.display = 'block';
    }
  });
});