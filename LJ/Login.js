document.addEventListener('DOMContentLoaded', () => {
  // --- Cookie Helper Functions ---
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

  setInterval(createFoodPicture, 300);

  // --- Sign-up and Login Logic ---
  const frontForm = document.querySelector('.front form');
  const backForm = document.querySelector('.back form');
  const loginError = document.getElementById('login-error');
  const signupPasswordError = document.getElementById('signup-password-error');
  const signupEmailError = document.getElementById('signup-email-error'); // New element

  const passwordInput = document.getElementById('signup-password');
  const emailInput = document.getElementById('signup-email'); // New element for email input
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
    requirements.length.classList.toggle('valid', lengthValid);
    requirements.special.classList.toggle('valid', specialValid);
    requirements.number.classList.toggle('valid', numberValid);
    requirements.capital.classList.toggle('valid', capitalValid);

    return lengthValid && specialValid && numberValid && capitalValid;
  }

  // WARNING: Storing passwords in cookies is not secure. This is for demonstration purposes only.
  backForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = backForm.querySelector('input[type="text"]').value;
    const email = emailInput.value; // Get email from the dedicated input
    const password = passwordInput.value; // Get password from the dedicated input

    // Clear previous error messages
    signupEmailError.style.display = 'none';
    signupPasswordError.style.display = 'none';

    // Validate password strength before proceeding
    if (!validatePassword(password)) {
      signupPasswordError.textContent = 'Password does not meet all requirements.';
      signupPasswordError.style.display = 'block';
      return; // Stop form submission
    }

    const existingUsers = JSON.parse(getCookie('users')) || [];
    const emailExists = existingUsers.some(user => user.email === email);

    if (emailExists) {
      signupEmailError.textContent = 'Email already exists. Please use a different email.';
      signupEmailError.style.display = 'block';
      return;
    }

    const newUser = {
      name,
      email,
      password
    };

    existingUsers.push(newUser);
    setCookie('users', JSON.stringify(existingUsers), 365); // Store users for 1 year (persistent)

    const successMessage = document.getElementById('signup-success-message');
    successMessage.style.display = 'block';

    setTimeout(() => {
      successMessage.style.display = 'none';
      document.getElementById('flip-toggle').checked = false; // Flip back to login
    }, 2000);
  });

  frontForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = frontForm.querySelector('input[type="email"]').value;
    const password = frontForm.querySelector('input[type="password"]').value;

    const existingUsers = JSON.parse(getCookie('users')) || [];
    const user = existingUsers.find(user => {
      const storedEmail = user.email;
      const enteredEmail = email;
      // Case-insensitive check for the first character, case-sensitive for the rest
      const firstCharMatch = storedEmail.charAt(0).toLowerCase() === enteredEmail.charAt(0).toLowerCase();
      const restOfEmailMatch = storedEmail.substring(1) === enteredEmail.substring(1);
      return firstCharMatch && restOfEmailMatch && user.password === password;
    });

    if (user) {
      setCookie('activeUserSession', user.name, 1); // Set active session for 1 day
      window.location.href = '../JH/Homepage.html';
    } else {
      loginError.textContent = 'Invalid email or password.';
      loginError.style.display = 'block';
    }
  });

  passwordInput.addEventListener('focus', () => {
    passwordRequirements.style.display = 'block';
    if (passwordInput.value.length > 0) {
      strengthBar.style.display = 'block';
    }
  });

  passwordInput.addEventListener('blur', () => {
    strengthBar.style.display = 'none';
    passwordRequirements.style.display = 'none';
  });

  passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    if (password.length > 0) {
      strengthBar.style.display = 'block';
    }
    else {
      strengthBar.style.display = 'none';
    }

    validatePassword(password); // Update visual feedback on input

    let strength = 0;

    const lengthValid = password.length >= 8;
    const specialValid = specialChars.test(password);
    const numberValid = numbers.test(password);
    const capitalValid = capitalLetters.test(password);

    if (lengthValid) strength++;
    if (specialValid) strength++;
    if (numberValid) strength++;
    if (capitalValid) strength++;

    const strengthPercentage = (strength / 4) * 100;
    strengthBar.style.setProperty('--clr', 
      strength <= 1 ? 'red' : strength <= 3 ? 'orange' : 'green');
    strengthBar.style.width = `${strengthPercentage}%`;

  });

  // Clear email error when user starts typing in email field
  emailInput.addEventListener('input', () => {
    signupEmailError.style.display = 'none';
  });

});
