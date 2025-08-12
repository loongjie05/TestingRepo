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