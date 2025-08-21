let images = [];
let currentIndex = 0;

window.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".slider");
  const imgTag = document.getElementById("slideImage");

  if (slider && imgTag) {
    const data = slider.getAttribute("data-images");
    if (data) {
      images = data.split(",");
      imgTag.src = images[0];
    }
  }
});

function showSlide(index) {
  const imgTag = document.getElementById("slideImage");
  if (imgTag && images.length > 0) {
    imgTag.src = images[index];
  }
}

function prevSlide() {
  if (images.length === 0) return;
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  showSlide(currentIndex);
}

function nextSlide() {
  if (images.length === 0) return;
  currentIndex = (currentIndex + 1) % images.length;
  showSlide(currentIndex);
}
