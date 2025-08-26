//Auto slide
let index = 0;
const track = document.querySelector('.food-middle'); //  scroll container
const cards = document.querySelectorAll('.food-card');
const total = cards.length;

// Auto slide every 2s
let slideInterval = setInterval(nextSlide, 2000);

function nextSlide() {
    index = (index + 1) % total;
    updateSlide();
}

function goToSlide(i) {
    index = i;
    updateSlide();
    resetInterval();
}

function updateSlide() {
    const cardWidth = cards[0].offsetWidth + 20; // 300px + 20px gap
    track.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
    });
}

function resetInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 3000);
}


// About Us Slideshow
let slides = document.querySelectorAll(".slideshow img");
let currentSlide = 0;

function showNextSlide() {
    slides[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add("active");
}

// Change every 3 seconds
setInterval(showNextSlide, 3000);

