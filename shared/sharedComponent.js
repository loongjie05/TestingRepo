function updateLoginStatus() {
            console.log('=== updateLoginStatus called ===');
            
            // Check for multiple login buttons (in case there are duplicates)
            const allLoginButtons = document.querySelectorAll('#login-button, .login-btn');
            console.log('🔍 Found login buttons:', allLoginButtons.length);
            
            const loginButton = document.getElementById('login-button');
            const userInfo = document.getElementById('user-info');
            const usernameDisplay = document.getElementById('username-display');
            const logoutButton = document.getElementById('logout-button');
            
            console.log('Elements found:', { loginButton, userInfo, usernameDisplay, logoutButton });
            
            // If multiple login buttons found, remove all but the first one
            if (allLoginButtons.length > 1) {
                console.log('🚨 Multiple login buttons found, removing duplicates');
                for (let i = 1; i < allLoginButtons.length; i++) {
                    allLoginButtons[i].remove();
                }
            }
            
            // Try to get user from multiple storage sources
            let currentUser = null;
            
            // Try localStorage first
            const localUser = localStorage.getItem('activeUserSession');
            if (localUser) {
                try {
                    currentUser = JSON.parse(localUser);
                    console.log('✅ Found user in localStorage:', currentUser);
                } catch (e) {
                    console.error('❌ Error parsing localStorage user:', e);
                }
            }
            
            // If no local user, try session storage
            if (!currentUser) {
                const sessionUser = sessionStorage.getItem('currentUser');
                if (sessionUser) {
                    try {
                        currentUser = JSON.parse(sessionUser);
                        console.log('✅ Found user in sessionStorage:', currentUser);
                    } catch (e) {
                        console.error('❌ Error parsing sessionStorage user:', e);
                    }
                }
            }
            
            // If no session user, try cookies
            if (!currentUser) {
                const cookieUser = getCookie('userSession');
                if (cookieUser) {
                    try {
                        currentUser = JSON.parse(cookieUser);
                        console.log('✅ Found user in cookies:', currentUser);
                    } catch (e) {
                        console.error('❌ Error parsing cookie user:', e);
                    }
                }
            }

            console.log('🔍 Final currentUser:', currentUser);

            if (currentUser && loginButton && userInfo && usernameDisplay) {
                console.log('✅ User is logged in, showing user info and HIDING login button');
                console.log('🔧 Setting loginButton.style.display = "none"');
                console.log('🔧 Setting userInfo.style.display = "flex"');
                
                // User is logged in - show user info and hide login button
                // Use multiple methods to ensure the button is hidden
                loginButton.style.display = 'none';
                loginButton.style.visibility = 'hidden';
                loginButton.style.opacity = '0';
                loginButton.style.pointerEvents = 'none';
                loginButton.style.position = 'absolute';
                loginButton.style.left = '-9999px';
                
                userInfo.style.display = 'flex';
                userInfo.style.visibility = 'visible';
                userInfo.style.opacity = '1';
                
                // Double-check the changes
                console.log('🔍 After changes - loginButton.display:', loginButton.style.display);
                console.log('🔍 After changes - userInfo.display:', userInfo.style.display);
                
                // Display first name if available, otherwise full name
                const displayName = currentUser.firstName || currentUser.userName || currentUser.name || 'User';
                usernameDisplay.textContent = `Welcome, ${displayName}`;
                
                // Add dropdown functionality
                setupUserDropdown();
                
                // Update counts
                updateDropdownCounts();
                
                // Add logout functionality
                if (logoutButton) {
                    logoutButton.addEventListener('click', handleLogout);
                }
                
                // Force another check after a short delay
                setTimeout(() => {
                    console.log('🔄 Delayed check - loginButton.display:', loginButton.style.display);
                    if (loginButton.style.display !== 'none') {
                        console.log('🚨 Login button still visible, forcing removal');
                        loginButton.remove();
                    }
                }, 100);
            } else if (loginButton && userInfo) {
                console.log('❌ User is not logged in, showing login button and hiding user info');
                console.log('🔧 Setting loginButton.style.display = "flex"');
                console.log('🔧 Setting userInfo.style.display = "none"');
                
                // User is not logged in - show login button and hide user info
                loginButton.style.display = 'flex';
                userInfo.style.display = 'none';
                
                // Double-check the changes
                console.log('🔍 After changes - loginButton.display:', loginButton.style.display);
                console.log('🔍 After changes - userInfo.display:', userInfo.style.display);
            } else {
                console.log('⚠️ Some elements not found, cannot update login status');
                if (!loginButton) console.log('❌ loginButton not found');
                if (!userInfo) console.log('❌ userInfo not found');
                if (!usernameDisplay) console.log('❌ usernameDisplay not found');
            }
        }

// Cookie helper function
function getCookie(name) {
    try {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    } catch (e) {
        console.error('Cookie error:', e);
        return null;
    }
}

       // Logout handler
       function handleLogout() {
           // Clear all storage types
           localStorage.removeItem('activeUserSession');
           sessionStorage.removeItem('currentUser');
           
           // Clear cookie
           document.cookie = 'userSession=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
           
           // Clear global user state
           window.currentUser = null;
           
           // Dispatch logout event
           window.dispatchEvent(new CustomEvent('userLogout'));
           
           // Update UI
           updateLoginStatus();
           
           // Redirect to homepage
           window.location.href = '../JH/Homepage.html';
       }
       
        // Setup user dropdown functionality
        function setupUserDropdown() {
            console.log('=== setupUserDropdown called ===');
            
            const usernameDisplay = document.getElementById('username-display');
            const userDropdown = document.getElementById('user-dropdown');
            const recentlyViewed = document.getElementById('recently-viewed');
            
            if (!usernameDisplay || !userDropdown) {
                console.log('❌ Dropdown elements not found:', { usernameDisplay, userDropdown });
                return;
            }
            
            console.log('✅ Dropdown elements found, setting up...');
            
            // Clear any existing event listeners by cloning and replacing
            const newUsernameDisplay = usernameDisplay.cloneNode(true);
            usernameDisplay.parentNode.replaceChild(newUsernameDisplay, usernameDisplay);
            
            // Get the new reference
            const newUsernameDisplayRef = document.getElementById('username-display');
            const newUserDropdownRef = document.getElementById('user-dropdown');
            
            // Toggle dropdown on username click
            newUsernameDisplayRef.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('🎯 Username clicked, toggling dropdown');
                
                const isVisible = newUserDropdownRef.classList.contains('show');
                if (isVisible) {
                    newUserDropdownRef.classList.remove('show');
                    newUsernameDisplayRef.classList.remove('dropdown-open');
                    // Remove backdrop
                    const backdrop = document.querySelector('.dropdown-backdrop');
                    if (backdrop) backdrop.classList.remove('show');
                    console.log('🔽 Dropdown hidden');
                } else {
                    // Create or show backdrop
                    let backdrop = document.querySelector('.dropdown-backdrop');
                    if (!backdrop) {
                        backdrop = document.createElement('div');
                        backdrop.className = 'dropdown-backdrop';
                        document.body.appendChild(backdrop);
                    }
                    backdrop.classList.add('show');
                    
                    // Calculate dropdown position relative to username
                    const usernameRect = newUsernameDisplayRef.getBoundingClientRect();
                    
                    // Position dropdown below username with proper centering
                    const dropdownWidth = 250; // Approximate dropdown width
                    const leftPos = Math.max(10, Math.min(window.innerWidth - dropdownWidth - 10, usernameRect.left + usernameRect.width/2 - dropdownWidth/2));
                    
                    // Use fixed positioning with calculated coordinates
                    newUserDropdownRef.style.position = 'fixed';
                    newUserDropdownRef.style.top = (usernameRect.bottom + 10) + 'px';
                    newUserDropdownRef.style.left = leftPos + 'px';
                    newUserDropdownRef.style.transform = 'none';
                    newUserDropdownRef.style.zIndex = '999999';
                    
                    newUserDropdownRef.classList.add('show');
                    newUsernameDisplayRef.classList.add('dropdown-open');
                    console.log('🔼 Dropdown shown at position:', {
                        top: newUserDropdownRef.style.top,
                        left: newUserDropdownRef.style.left,
                        usernameRect: usernameRect,
                        zIndex: newUserDropdownRef.style.zIndex
                    });
                }
            });
            
            // Close dropdown when clicking outside or on dropdown items
            document.addEventListener('click', function(e) {
                // If clicking on a dropdown item, close dropdown and allow navigation
                if (newUserDropdownRef.contains(e.target) && e.target.closest('.dropdown-item')) {
                    console.log('🎯 Dropdown item clicked, closing dropdown and allowing navigation');
                    newUserDropdownRef.classList.remove('show');
                    newUsernameDisplayRef.classList.remove('dropdown-open');
                    // Remove backdrop
                    const backdrop = document.querySelector('.dropdown-backdrop');
                    if (backdrop) backdrop.classList.remove('show');
                    return; // Allow the link to work naturally
                }
                
                // If clicking outside dropdown, close it
                if (!newUserDropdownRef.contains(e.target) && !newUsernameDisplayRef.contains(e.target)) {
                    newUserDropdownRef.classList.remove('show');
                    newUsernameDisplayRef.classList.remove('dropdown-open');
                    // Remove backdrop
                    const backdrop = document.querySelector('.dropdown-backdrop');
                    if (backdrop) backdrop.classList.remove('show');
                    console.log('🔽 Dropdown closed (clicked outside)');
                }
            });
            
            // Setup dropdown item functionality
            const dropdownItems = newUserDropdownRef.querySelectorAll('.dropdown-item');
            dropdownItems.forEach(item => {
                item.addEventListener('click', function(e) {
                    console.log('🎯 Dropdown item clicked:', this.href);
                    // Close dropdown
                    newUserDropdownRef.classList.remove('show');
                    newUsernameDisplayRef.classList.remove('dropdown-open');
                    // Remove backdrop
                    const backdrop = document.querySelector('.dropdown-backdrop');
                    if (backdrop) backdrop.classList.remove('show');
                    // Allow navigation to proceed naturally
                    console.log('✅ Allowing navigation to:', this.href);
                    
                    // Test navigation
                    setTimeout(() => {
                        console.log('🧪 Testing navigation...');
                        window.location.href = this.href;
                    }, 100);
                });
            });
            
            console.log('✅ Dropdown items setup complete');
            
            console.log('✅ Dropdown setup complete');
        }
       
               // Update dropdown counts
        function updateDropdownCounts() {
            // Update favourites count - use the correct key that matches the favourites page
            const favourites = JSON.parse(localStorage.getItem('favourites') || '[]');
            const favouritesCount = document.getElementById('favourites-count');
            if (favouritesCount) {
                favouritesCount.textContent = favourites.length;
                console.log('Favourites count updated:', favourites.length);
            }
            
            // Update recently viewed count
            const recentlyViewed = JSON.parse(sessionStorage.getItem('recentlyViewed') || '[]');
            const recentlyCount = document.getElementById('recently-count');
            if (recentlyCount) {
                recentlyCount.textContent = recentlyViewed.length;
                console.log('Recently viewed count updated:', recentlyViewed.length);
            }
        }
       
       // Show recently viewed modal
       function showRecentlyViewed() {
           const recentlyViewed = JSON.parse(sessionStorage.getItem('recentlyViewed') || '[]');
           
           if (recentlyViewed.length === 0) {
               alert('No recently viewed foods yet.');
               return;
           }
           
           // Create modal content
           let modalContent = '<div style="max-height: 400px; overflow-y: auto;">';
           modalContent += '<h3 style="margin-bottom: 15px; color: #70130b;">Recently Viewed Foods</h3>';
           
           recentlyViewed.forEach((food, index) => {
               modalContent += `
                   <div style="display: flex; align-items: center; gap: 10px; padding: 10px; border-bottom: 1px solid #eee; margin-bottom: 5px;">
                       <div style="width: 50px; height: 50px; background: #f0f0f0; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
                           🍽️
                       </div>
                       <div style="flex: 1;">
                           <div style="font-weight: 600; color: #333;">${food.title}</div>
                           <div style="font-size: 0.9rem; color: #666;">${food.country || 'Unknown'}</div>
                       </div>
                       <button onclick="viewFoodDetails('${food.title}')" style="background: #70130b; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; font-size: 0.8rem;">
                           View
                       </button>
                   </div>
               `;
           });
           
           modalContent += '</div>';
           
           // Show modal
           showCustomModal('Recently Viewed Foods', modalContent);
       }
       
       // Show custom modal
       function showCustomModal(title, content) {
           // Remove existing modal if any
           const existingModal = document.getElementById('custom-modal');
           if (existingModal) {
               existingModal.remove();
           }
           
           const modal = document.createElement('div');
           modal.id = 'custom-modal';
           modal.style.cssText = `
               position: fixed;
               top: 0;
               left: 0;
               width: 100%;
               height: 100%;
               background: rgba(0, 0, 0, 0.5);
               display: flex;
               align-items: center;
               justify-content: center;
               z-index: 10000;
           `;
           
           const modalContent = document.createElement('div');
           modalContent.style.cssText = `
               background: white;
               padding: 25px;
               border-radius: 15px;
               max-width: 500px;
               width: 90%;
               max-height: 80vh;
               overflow-y: auto;
               box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
           `;
           
           modalContent.innerHTML = `
               <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                   <h2 style="margin: 0; color: #70130b;">${title}</h2>
                   <button onclick="this.closest('#custom-modal').remove()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #666;">×</button>
               </div>
               ${content}
           `;
           
           modal.appendChild(modalContent);
           document.body.appendChild(modal);
           
           // Close modal when clicking outside
           modal.addEventListener('click', function(e) {
               if (e.target === modal) {
                   modal.remove();
               }
           });
       }
       
               // Global function to view food details
        window.viewFoodDetails = function(foodTitle) {
            // Close modal
            const modal = document.getElementById('custom-modal');
            if (modal) {
                modal.remove();
            }
            
            // Navigate to food info page
            window.location.href = `../Ben/FoodInfo.html?food=${encodeURIComponent(foodTitle)}`;
        };
        
        // Debug function to test dropdown
        window.testDropdown = function() {
            console.log('Testing dropdown functionality...');
            const usernameDisplay = document.getElementById('username-display');
            const userDropdown = document.getElementById('user-dropdown');
            console.log('Username display:', usernameDisplay);
            console.log('User dropdown:', userDropdown);
            if (usernameDisplay && userDropdown) {
                console.log('Dropdown elements found, testing click...');
                usernameDisplay.click();
            }
        };
        
        // Manual trigger for dropdown setup
        window.forceDropdownSetup = function() {
            console.log('Forcing dropdown setup...');
            setupUserDropdown();
        };

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
                        <a href="../JH/Homepage.html" class="logo">
                            <div class="logo-icon">
                                <i class="fas fa-utensils"></i>
                            </div>
                            <div class="logo-text">Jalan<span>Jalan</span>Makan</div>
                        </a>
                    </div>
                    
                    <div class="nav-section">
                        <div class="nav-links">
                            <a href="../JH/Homepage.html" class="nav-link">Home</a>
                            <a href="../Ben/Ranking.html" class="nav-link">Ranking</a>
                            <a href="../JY/Recipe.html" class="nav-link">Recipes</a>
                            <a href="../JY/Map.html" class="nav-link">Map</a>
                            <a href="../Ben/FoodInfo.html" class="nav-link">Food Info</a>
                            <a href="../LJ/food-feed.html" class="nav-link">Food Feed</a>
                            <a href="../JH/aboutUs.html" class="nav-link">About Us</a>
                        </div>
                    </div>
                    
                    <div class="login-section">
                        <a href="../Ben/favourites.html" class="fav-link" title="Favourites" aria-label="Favourites">
                            <i class="fa-solid fa-heart"></i>
                        </a>
                        <button id="login-button" class="login-btn" onclick="window.location.href='../LJ/Login.html'">
                            <i class="fas fa-user"></i>
                            <span>Login</span>
                        </button>
                                                       <div id="user-info" style="display: none;">
                                   <span id="username-display"></span>
                                   <div id="user-dropdown">
                                       <a href="../Ben/favourites.html" class="dropdown-item">
                                           <i class="fas fa-heart"></i>
                                           <span class="item-text">Favourites</span>
                                           <span class="item-count" id="favourites-count">0</span>
                                       </a>
                                       <a href="../Ben/recently-viewed.html" class="dropdown-item" id="recently-viewed">
                                           <i class="fas fa-clock"></i>
                                           <span class="item-text">Recently Viewed</span>
                                           <span class="item-count" id="recently-count">0</span>
                                       </a>
                                   </div>
                                   <button id="logout-button" class="login-btn">
                                       <i class="fas fa-sign-out-alt"></i>
                                       <span>Logout</span>
                        </button>
                               </div>
                    </div>
                </div>
            </header>
        `;
        
        // Update login status for fallback header
        updateLoginStatus();
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
                            <a href="https://www.facebook.com/profile.php?id=61579960857433" class="social-link" data-platform="facebook" target="_blank" rel="noopener noreferrer">
                                <div class="social-icon"><i class="fab fa-facebook-f"></i></div>
                                <span>Facebook</span>
                            </a>
                            <a href="https://www.instagram.com/makan.jalanjalan/" class="social-link" data-platform="instagram" target="_blank" rel="noopener noreferrer">
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
    console.log('=== bindHeaderEvents called ===');
    
    // Force update login status immediately
    updateLoginStatus();
    
    // Login button
    const loginBtn = document.querySelector('.login-btn');
    if(loginBtn){
        console.log('✅ Login button found, adding event listener');
        loginBtn.addEventListener('click', () => {
            const activeUser = localStorage.getItem('activeUserSession') || 
                             sessionStorage.getItem('currentUser') || 
                             getCookie('userSession');
            
            if (activeUser) {
                // If user is logged in, maybe go to a profile page?
                // For now, just logs to console.
                console.log('User profile clicked');
            } else {
                window.location.href='../LJ/Login.html'
            }
        });
    } else {
        console.log('❌ Login button not found');
    }

    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e){
            // No need to prevent default here, as links should navigate
            const pageName = this.textContent.toLowerCase().replace(' ', '-');
            console.log(`Navigating to ${pageName} page`);
        });
    });
    
    console.log('✅ Header events bound successfully');
    
    // Force another update after a short delay to ensure everything is loaded
    setTimeout(() => {
        console.log('🔄 Forcing delayed login status update...');
        updateLoginStatus();
    }, 100);
}

// ---------- Footer events ----------
function bindFooterEvents() {
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const platform = this.dataset.platform;
            console.log(`Navigating to our ${platform} page`);
            // Allow default behavior for external links
        });
    });
}

// Listen for login/logout events from other components
window.addEventListener('userLogin', (event) => {
    console.log('User login event received:', event.detail);
    updateLoginStatus();
});

window.addEventListener('userLogout', () => {
    console.log('User logout event received');
    updateLoginStatus();
});

// Ensure header and footer are loaded after the DOM is fully parsed
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== DOM Content Loaded ===');
    loadHTML("header", "../shared/header.html");
    loadHTML("footer", "../shared/footer.html");
    
    // Update login status after a longer delay to ensure header is fully loaded
    setTimeout(() => {
        console.log('🔄 DOM loaded, updating login status...');
        updateLoginStatus();
        
        // Try the override approach if normal update doesn't work
        setTimeout(() => {
            console.log('🔄 Trying header override approach...');
            overrideHeaderForLoggedInUser();
        }, 300);
        
        // Force another update after header events are bound
        setTimeout(() => {
            console.log('🔄 Forcing final login status update...');
            updateLoginStatus();
        }, 500);
    }, 500);
});

// Add manual trigger for testing
window.forceLoginUpdate = function() {
    console.log('🔄 Manual login update triggered');
    updateLoginStatus();
};

// Completely override header when user is logged in
window.overrideHeaderForLoggedInUser = function() {
    console.log('🚨 OVERRIDING HEADER FOR LOGGED IN USER');
    
    const currentUser = localStorage.getItem('activeUserSession') || 
                       sessionStorage.getItem('currentUser') || 
                       getCookie('userSession');
    
    if (currentUser) {
        try {
            const user = JSON.parse(currentUser);
            const displayName = user.firstName || user.userName || user.name || 'User';
            
            // Find the login section and replace it
            const loginSection = document.querySelector('.login-section');
            if (loginSection) {
                console.log('🔧 Replacing login section with user info');
                loginSection.innerHTML = `
                    <a href="../Ben/favourites.html" class="fav-link" title="Favourites" aria-label="Favourites">
                        <i class="fa-solid fa-heart"></i>
                    </a>
                    <div id="user-info" style="display: flex;">
                        <span id="username-display">Welcome, ${displayName}</span>
                        <div id="user-dropdown">
                            <a href="../Ben/favourites.html" class="dropdown-item">
                                <i class="fas fa-heart"></i>
                                <span class="item-text">Favourites</span>
                                <span class="item-count" id="favourites-count">0</span>
                            </a>
                            <a href="../Ben/recently-viewed.html" class="dropdown-item" id="recently-viewed">
                                <i class="fas fa-clock"></i>
                                <span class="item-text">Recently Viewed</span>
                                <span class="item-count" id="recently-count">0</span>
                            </a>
                        </div>
                        <button id="logout-button" class="login-btn">
                            <i class="fas fa-sign-out-alt"></i>
                            <span>Logout</span>
                        </button>
                    </div>
                `;
                
                // Setup the new elements
                setupUserDropdown();
                updateDropdownCounts();
                
                // Add logout functionality
                const logoutButton = document.getElementById('logout-button');
                if (logoutButton) {
                    logoutButton.addEventListener('click', handleLogout);
                }
                
                console.log('✅ Header overridden successfully');
            } else {
                console.log('❌ Login section not found');
            }
        } catch (e) {
            console.error('❌ Error overriding header:', e);
        }
    } else {
        console.log('❌ No user found, cannot override header');
    }
};

// Add function to check current state
window.checkLoginState = function() {
    console.log('=== Checking Login State ===');
    console.log('localStorage activeUserSession:', localStorage.getItem('activeUserSession'));
    console.log('sessionStorage currentUser:', sessionStorage.getItem('currentUser'));
    console.log('cookie userSession:', getCookie('userSession'));
    
    const loginButton = document.getElementById('login-button');
    const userInfo = document.getElementById('user-info');
    const usernameDisplay = document.getElementById('username-display');
    
    console.log('Elements state:', {
        loginButton: loginButton ? { display: loginButton.style.display, text: loginButton.textContent } : 'NOT FOUND',
        userInfo: userInfo ? { display: userInfo.style.display } : 'NOT FOUND',
        usernameDisplay: usernameDisplay ? { display: usernameDisplay.style.display, text: usernameDisplay.textContent } : 'NOT FOUND'
    });
};

// Force hide login button and show user info
window.forceHideLoginButton = function() {
    console.log('🚨 FORCE HIDING LOGIN BUTTON');
    const loginButton = document.getElementById('login-button');
    const userInfo = document.getElementById('user-info');
    
    if (loginButton) {
        console.log('🔧 Setting loginButton.style.display = "none"');
        loginButton.style.display = 'none';
        loginButton.style.visibility = 'hidden';
        loginButton.style.opacity = '0';
        loginButton.style.pointerEvents = 'none';
        console.log('✅ Login button hidden with multiple methods');
    }
    
    if (userInfo) {
        console.log('🔧 Setting userInfo.style.display = "flex"');
        userInfo.style.display = 'flex';
        userInfo.style.visibility = 'visible';
        userInfo.style.opacity = '1';
        console.log('✅ User info shown with multiple methods');
    }
    
    // Also try to remove the login button entirely
    if (loginButton && loginButton.parentNode) {
        console.log('🗑️ Removing login button from DOM');
        loginButton.remove();
    }
};

// Force dropdown to be on top
window.forceDropdownOnTop = function() {
    console.log('🚨 FORCING DROPDOWN ON TOP');
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) {
        // Force all critical properties
        dropdown.style.position = 'fixed';
        dropdown.style.zIndex = '999999';
        dropdown.style.top = '82px';
        dropdown.style.left = '50%';
        dropdown.style.transform = 'translateX(-50%)';
        dropdown.style.overflow = 'visible';
        dropdown.style.contain = 'none';
        
        // Force visibility
        dropdown.style.opacity = '1';
        dropdown.style.visibility = 'visible';
        dropdown.style.display = 'block';
        
        console.log('✅ Dropdown forced to top with z-index:', dropdown.style.zIndex);
        console.log('✅ Dropdown position:', dropdown.style.position);
        console.log('✅ Dropdown overflow:', dropdown.style.overflow);
    }
};

// Emergency dropdown fix
window.emergencyDropdownFix = function() {
    console.log('🚨 EMERGENCY DROPDOWN FIX');
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) {
        // Remove from DOM and re-append to body to break out of any clipping containers
        const parent = dropdown.parentNode;
        if (parent && parent !== document.body) {
            document.body.appendChild(dropdown);
            console.log('✅ Dropdown moved to body to escape clipping');
        }
        
        // Force all styles
        dropdown.style.cssText = `
            position: fixed !important;
            z-index: 999999 !important;
            top: 82px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            overflow: visible !important;
            contain: none !important;
            opacity: 1 !important;
            visibility: visible !important;
            display: block !important;
        `;
        
        console.log('✅ Emergency dropdown fix applied');
    }
};
