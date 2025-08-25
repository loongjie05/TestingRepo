// ---------- Load external HTML (header & footer) ----------
function loadHTML(id, url) {
    // Use XMLHttpRequest instead of fetch for better file:// protocol support
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                document.getElementById(id).innerHTML = xhr.responseText;
                if(id === "header") bindHeaderEvents();
                if(id === "footer") bindFooterEvents();
                adjustContentMargin();
            } else {
                // Fallback: try to load using iframe method
                loadHTMLWithIframe(id, url);
            }
        }
    };
    xhr.onerror = function() {
        // Fallback: try to load using iframe method
        loadHTMLWithIframe(id, url);
    };
    xhr.send();
}

// Fallback method using iframe technique
function loadHTMLWithIframe(id, url) {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    
    iframe.onload = function() {
        try {
            const content = iframe.contentDocument.body.innerHTML;
            document.getElementById(id).innerHTML = content;
            if(id === "header") bindHeaderEvents();
            if(id === "footer") bindFooterEvents();
            adjustContentMargin();
        } catch (e) {
            console.warn('Could not load ' + url + ' using iframe method');
            // Final fallback: create a simple placeholder
            createPlaceholder(id);
        }
        document.body.removeChild(iframe);
    };
    
    iframe.onerror = function() {
        console.warn('Iframe failed to load ' + url);
        createPlaceholder(id);
        document.body.removeChild(iframe);
    };
    
    document.body.appendChild(iframe);
}

// Final fallback: create simple placeholders
function createPlaceholder(id) {
    if (id === "header") {
        document.getElementById(id).innerHTML = `
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
                            <a href="../JH/Homepage.html" class="nav-link">Home</a>
                            <a href="../Ben/Ranking.html" class="nav-link">Ranking</a>
                            <a href="../JY/Recipe.html" class="nav-link">Recipes</a>
                            <a href="../JY/Map.html" class="nav-link">Map</a>
                            <a href="../LJ/food-feed.html" class="nav-link">Food Feed</a>
                            <a href="../JH/aboutUs.html" class="nav-link">About Us</a>
                        </div>
                    </div>
                    
                    <div class="login-section">
                        <button class="login-btn" onclick="window.location.href='../LJ/Login.html'">
                            <i class="fas fa-user"></i>
                             Login
                        </button>
                    </div>
                </div>
            </header>
        `;
    } else if (id === "footer") {
        document.getElementById(id).innerHTML = `
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
    }
}

// ---------- Adjust main content margin ----------
function adjustContentMargin() {
    const header = document.querySelector("header");
    // Added .feed-container to the selector for better targeting of main content in food-feed.html
    const mainContent = document.querySelector(".world-map, main, .main, .content, .feed-container");
    if(header && mainContent){
        mainContent.style.marginTop = header.offsetHeight + "px";
    }
}
window.addEventListener("resize", adjustContentMargin);

// ---------- Header events ----------
function bindHeaderEvents() {
    // Login button
    const loginBtn = document.querySelector('.login-btn');
    if(loginBtn){
        loginBtn.addEventListener('click', () => console.log('Login button clicked'));
    }

    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e){
            // No need to prevent default here, as links should navigate
            const pageName = this.textContent.toLowerCase().replace(' ', '-');
            console.log(`Navigating to ${pageName} page`);
        });
    });
}

// ---------- Footer events ----------
function bindFooterEvents() {
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.dataset.platform;
            console.log(`Redirecting to our ${platform} page`);
        });
    });
}

// Ensure header and footer are loaded after the DOM is fully parsed
document.addEventListener('DOMContentLoaded', () => {
    loadHTML("header", "../shared/header.html");
    loadHTML("footer", "../shared/footer.html");
});
