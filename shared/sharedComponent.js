// ---------- Load external HTML (header & footer) ----------
function loadHTML(id, url) {
    fetch(url)
        .then(res => res.text())
        .then(html => {
            document.getElementById(id).innerHTML = html;
            if(id === "header") bindHeaderEvents();
            if(id === "footer") bindFooterEvents();
            adjustContentMargin();
        });
}

// Load header and footer
loadHTML("header", "../shared/header.html");
loadHTML("footer", "../shared/footer.html");

// ---------- Adjust main content margin ----------
function adjustContentMargin() {
    const header = document.querySelector("header");
    const mainContent = document.querySelector(".world-map, main, .main, .content");
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
            const pageName = this.textContent.toLowerCase().replace(' ', '-');
            console.log(`Navigating to ${pageName} page`);
            // Uncomment for real navigation:
            // window.location.href = `${pageName}.html`;
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
            // Uncomment for real navigation:
            // window.open(`https://${platform}.com/jalanjalanmakan`);
        });
    });
}
