document.addEventListener('DOMContentLoaded', () => {
  // Keep existing form submission logic if any
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', (event) => {
      // This is just for demonstration if you have a form
      // event.preventDefault();
      // alert('Form submitted!');
    });
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

  // The animation function now only handles animation and removal
  function animateFoodPicture(img) {
    const animationDuration = Math.random() * 5 + 8;
    requestAnimationFrame(() => {
      img.style.transition = `transform ${animationDuration}s linear, opacity ${animationDuration}s linear`;
      img.style.transform = `translateY(${window.innerHeight + 150}px)`;
      img.style.opacity = '0';
    });

    // When the animation is over, just remove the element
    img.addEventListener('transitionend', () => {
      img.remove();
    }, { once: true });
  }

  // The picture creation function
  function createFoodPicture() {
    const img = document.createElement('img');
    img.classList.add('food-picture');
    img.src = foodPictures[Math.floor(Math.random() * foodPictures.length)];
    
    // Set initial styles
    img.style.position = 'absolute';
    img.style.left = `${Math.random() * 100}vw`;
    img.style.top = '-150px';
    img.style.width = `${Math.random() * 30 + 20}px`;
    img.style.opacity = '1';
    img.style.transform = 'translateY(0px)';
    img.style.willChange = 'transform, opacity';

    document.body.appendChild(img);
    animateFoodPicture(img);
  }

  // Start the continuous rain effect
  // Create a new picture every 300 milliseconds
  setInterval(createFoodPicture, 300);

});

// You can keep other functions like doFunStuff if they are used elsewhere
function doFunStuff() {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}
