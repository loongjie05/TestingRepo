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

document.getElementById('header').innerHTML = `
<header>
    <div class="header-container">
        <div class="logo-section">
            <div class="logo">
                <div class="logo-icon">
                    <i class="fas fa-utensils"></i>
                </div>
                <div class="logo-text">Jalan<span>Jalan</span>Makan</div>
            </div>
        </div>
        
        <div class="nav-section">
            <div class="nav-links">
                <a href="../../JH/Homepage.html" class="nav-link">Home</a>
                <a href="../../Ben/Ranking.html" class="nav-link">Ranking</a>
                <a href="../../JY/Recipe.html" class="nav-link">Recipes</a>
                <a href="../../JY/Map.html" class="nav-link">Map</a>
                <a href="../../JH/aboutUs.html" class="nav-link">About Us</a>
            </div>
        </div>
        
        <div class="login-section">
            <button class="login-btn" onclick="window.location.href='../LJ/Login.html'">
                <i class="fas fa-user"></i> Login
            </button>
        </div>
    </div>
</header>
`;

document.getElementById('footer').innerHTML = `
<footer>
    <div class="footer-container">
        <div class="footer-section">
            <div class="footer-title">Jalan Jalan Makan</div>
            <p class="footer-description">Your ultimate food discovery platform</p>
            <div class="copyright">
                &copy; 2023 All rights reserved
            </div>
        </div>
        
        <div class="footer-section">
            <div class="footer-title">Connect</div>
            <div class="social-links">
                <a href="#" class="social-link" data-platform="facebook">
                    <div class="social-icon"><i class="fab fa-facebook-f"></i></div>
                    <span>Facebook</span>
                </a>
                <a href="#" class="social-link" data-platform="instagram">
                    <div class="social-icon"><i class="fab fa-instagram"></i></div>
                    <span>Instagram</span>
                </a>
            </div>
        </div>
        
        <div class="footer-section">
            <div class="footer-title">Team</div>
            <div class="team-grid">
                <div class="team-member">
                    <div class="member-name">Wong Jie Ying</div>
                    <div class="member-role">PM</div>
                </div>
                <div class="team-member">
                    <div class="member-name">Liew Kaiy Bin</div>
                    <div class="member-role">Developer</div>
                </div>
                <div class="team-member">
                    <div class="member-name">Mah Juin Hong</div>
                    <div class="member-role">Designer</div>
                </div>
                <div class="team-member">
                    <div class="member-name">Wong Loong Jie</div>
                    <div class="member-role">Content</div>
                </div>
            </div>
        </div>
    </div>
</footer>
`;
// Navigation functionality
document.querySelectorAll('.nav-link').forEach(button => {
    button.addEventListener('click', function() {
        const pageName = this.textContent.toLowerCase().replace(' ', '-');
        // In real implementation: window.location.href = `${pageName}.html`;
        console.log(`Navigating to ${pageName} page`);
    });
});

// Login button functionality
document.querySelector('.login-btn').addEventListener('click', function() {
    // In real implementation: show login modal
    console.log('Login button clicked');
});

// Social media links
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const platform = this.getAttribute('data-platform');
        // In real implementation: window.open(`https://${platform}.com/jalanjalanmakan`);
        console.log(`Redirecting to our ${platform} page`);
    });
});

