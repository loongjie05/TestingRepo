// Recently Viewed Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== Recently Viewed Page Loaded ===');
    
    // Load recently viewed foods
    loadRecentlyViewedFoods();
    
    // Add clear button functionality
    setupClearButton();
});

// Load and display recently viewed foods
function loadRecentlyViewedFoods() {
    const recentlyViewed = JSON.parse(sessionStorage.getItem('recentlyViewed') || '[]');
    const contentContainer = document.getElementById('recently-viewed-content');
    const emptyState = document.getElementById('empty-state');
    
    console.log('🔍 Loading recently viewed foods:', recentlyViewed);
    
    if (recentlyViewed.length === 0) {
        // Show empty state
        contentContainer.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    // Show content, hide empty state
    contentContainer.style.display = 'block';
    emptyState.style.display = 'none';
    
    // Wait for shared data to be loaded before creating content
    if (window.SiteData && window.SiteData.foods) {
        createPageContent(recentlyViewed);
    } else {
        // If shared data not loaded yet, wait for it
        console.log('⏳ Waiting for shared data to load...');
        const checkData = setInterval(() => {
            if (window.SiteData && window.SiteData.foods) {
                clearInterval(checkData);
                console.log('✅ Shared data loaded, creating content...');
                createPageContent(recentlyViewed);
            }
        }, 100);
        
        // Fallback: if data doesn't load within 5 seconds, create content anyway
        setTimeout(() => {
            if (checkData) {
                clearInterval(checkData);
                console.log('⚠️ Shared data not loaded, creating content with fallback...');
                createPageContent(recentlyViewed);
            }
        }, 5000);
    }
}

// Create page content with proper data
function createPageContent(recentlyViewed) {
    const contentContainer = document.getElementById('recently-viewed-content');
    
    // Create session info
    const sessionInfo = createSessionInfo(recentlyViewed);
    
    // Create food grid
    const foodGrid = createFoodGrid(recentlyViewed);
    
    // Clear existing content and add new content
    contentContainer.innerHTML = '';
    contentContainer.appendChild(sessionInfo);
    contentContainer.appendChild(foodGrid);
    
    // Add animations
    addAnimations();
}

// Create session information section
function createSessionInfo(foods) {
    const sessionInfo = document.createElement('div');
    sessionInfo.className = 'session-info animate__animated animate__fadeIn';
    
    const sessionDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    sessionInfo.innerHTML = `
        <h3>
            <i class="fas fa-calendar-alt"></i>
            Session Information
        </h3>
        <p>
            <strong>${foods.length}</strong> foods viewed in this session • 
            <strong>${sessionDate}</strong>
        </p>
    `;
    
    return sessionInfo;
}

// Create food grid
function createFoodGrid(foods) {
    const foodGrid = document.createElement('div');
    foodGrid.className = 'food-grid';
    
    // Reverse array to show most recent first
    const reversedFoods = [...foods].reverse();
    
    reversedFoods.forEach((food, index) => {
        const foodCard = createFoodCard(food, index);
        foodGrid.appendChild(foodCard);
    });
    
    return foodGrid;
}

// Create individual food card
function createFoodCard(food, index) {
    const foodCard = document.createElement('div');
    foodCard.className = 'food-card animate__animated animate__fadeInUp';
    foodCard.style.animationDelay = `${index * 0.1}s`;
    
    // Get food data from shared data if available
    const foodData = getFoodData(food.title);
    
    // Use the same image mapping approach as FoodInfo page
    let imageSrc = '';
    
    // First try to get image from shared data
    if (foodData && foodData.images) {
        if (Array.isArray(foodData.images)) {
            imageSrc = foodData.images[0];
        } else if (foodData.images.cover) {
            imageSrc = foodData.images.cover;
        }
    }
    
    // If no image from shared data, use the same image mapping as FoodInfo
    if (!imageSrc) {
        // Import the same image mapping used in FoodInfo
        const foodImageMap = {
            // Malaysian Foods
            "Nasi Lemak": "../street food/picture/NasiLemak1.webp",
            "Laksa": "../street food/picture/Laksa1.jpg",
            "Char Kway Teow": "../street food/picture/CharKwayTeow1.jpg",
            "Roti Canai": "../street food/picture/RotiCanai1.jpg",
            "Nasi Kandar": "../street food/picture/NasiKandar1.jpg",
            "Hokkien Mee": "../street food/picture/HokkienMee1.jpg",
            "Cendol": "../street food/picture/Cendol1.webp", 
            "Asam Laksa": "../street food/picture/Laksa2.jpg",
            "Nasi Kerabu": "../street food/picture/NasiKerabu1.jpg",
            "Rojak": "../street food/picture/Rojak1.jpg",
            "Satay": "../street food/picture/Satay1.avif",
            
            // Asian Foods
            "Mango Sticky Rice": "../street food/picture/MangoRice1.jpg",
            "Sushi": "../street food/picture/Sushi1.webp",
            "Ramen": "../street food/picture/Ramen1.jpg",
            "Pad Thai": "../street food/picture/PadThai1.webp",
            "Falafel": "../street food/picture/Falafel1.jpg",
            "Takoyaki": "../street food/picture/Takoyaki1.avif",
            "Dumplings": "../street food/picture/Dumplings1.jpg",
            "Biryani": "../street food/picture/Biryani1.jpg",
            "Pho": "../street food/picture/Pho1.webp",
            "Tom Yum": "../street food/picture/TomYum1.jpg",
            "Peking Duck": "../street food/picture/PekingDuck1.jpg",
            
            // North American Foods
            "Taco": "../street food/picture/Taco1.jpg",
            "Hamburger": "../street food/picture/Hamburger1.jpg",
            "Hot Dog": "../street food/picture/HotDog1.jpg",
            "Poutine": "../street food/picture/Poutine1.jpg",
            "Jerk Chicken": "../street food/picture/JerkChicken1.jpg",
            "Burrito": "../street food/picture/Burrito1.jpg",
            "Nachos": "../street food/picture/Nachos1.jpg",
            "Clam Chowder": "../street food/picture/ClamChowder1.jpg",
            "Gumbo": "../street food/picture/Gumbo1.jpg",
            "Buffalo Wings": "../street food/picture/BuffaloWings1.jpg",
            "Bagel with Lox": "../street food/picture/BagelLox1.jpg",
            "Philly Cheesesteak": "../street food/picture/PhillyCheesesteak1.webp",
            
            // European Foods
            "Churros": "../street food/picture/Churros1.webp",
            "Fish and Chips": "../street food/picture/FishAndChips1.webp",
            "Paella": "../street food/picture/Paella1.jpg",
            "Pizza Margherita": "../street food/picture/PizzaMargherita1.webp",
            "Gyro": "../street food/picture/Gyro1.webp",
            "Pierogi": "../street food/picture/Pierogi1.jpg",
            "Goulash": "../street food/picture/Goulash1.jpg",
            "Bratwurst": "../street food/picture/Bratwurst1.jpg",
            "Crêpes": "../street food/picture/Crêpes1.jpg",
            "Doner Kebab": "../street food/picture/DonerKebab1.jpg",
            "Baguette Sandwich": "../street food/picture/BaguetteSandwich1.jpg",
            
            // South American Foods
            "Arepas": "../street food/picture/Arepas1.jpg",
            "Empanadas": "../street food/picture/Empanadas1.webp",
            "Feijoada": "../street food/picture/Feijoada1.jpg",
            "Asado": "../street food/picture/Asado1.jpg",
            "Ceviche": "../street food/picture/Ceviche1.jpg",
            "Pão de Queijo": "../street food/picture/PaoDeQueijo1.jpg",
            "Churrasco": "../street food/picture/Churrasco1.jpg",
            "Choripán": "../street food/picture/Choripan1.jpg",
            "Moqueca": "../street food/picture/Moqueca1.jpg",
            "Ajiaco": "../street food/picture/Ajiaco1.jpg",
            
            // African Foods
            "Bunny Chow": "../street food/picture/BunnyChow1.webp",
            "Jollof Rice": "../street food/picture/JollofRice1.jpg",
            "Bobotie": "../street food/picture/Bobotie1.jpg",
            "Tagine": "../street food/picture/Tagine1.jpeg",
            "Injera with Doro Wat": "../street food/picture/Injera1.jpg",
            "Koshari": "../street food/picture/Koshari1.jpg",
            "Suya": "../street food/picture/Suya1.jpg",
            "Nyama Choma": "../street food/picture/NyamaChoma1.png",
            "Shakshuka": "../street food/picture/Shakshuka1.jpg",
            
            // Oceania Foods
            "Meat Pie": "../street food/picture/MeatPie1.jpg",
            "Lamingtons": "../street food/picture/Lamingtons1.jpg",
            "Pavlova": "../street food/picture/Pavlova1.jpg",
            "Sausage Sizzle": "../street food/picture/SausageSizzle1.jpg",
            "Chiko Roll": "../street food/picture/ChikoRoll1.jpg",
            "Barramundi": "../street food/picture/Barramundi1.webp",
            "Kangaroo Steak": "../street food/picture/KangarooSteak1.jpg",
            "Fairy Bread": "../street food/picture/FairyBread1.jpg",
            "Dagwood Dog": "../street food/picture/DagwoodDog1.jpg",
            "Hamdog": "../street food/picture/Hamdog1.jpeg"
        };
        
        // Get image from the mapping
        imageSrc = foodImageMap[food.title] || '../LJ/pictures/cooking.jpg';
    }
    
    console.log('🖼️ Image path resolved:', imageSrc);
    
    const country = foodData?.country || food.country || 'Unknown';
    const price = foodData?.price || 'N/A';
    const score = foodData?.score || 'N/A';
    
    console.log('🖼️ Creating food card for:', food.title);
    console.log('   - Food data found:', !!foodData);
    console.log('   - Image source:', imageSrc);
    console.log('   - Food data images:', foodData?.images);
    
    foodCard.innerHTML = `
        <div class="food-image">
            ${imageSrc ? 
                `<img src="${imageSrc}" alt="${food.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'; this.nextElementSibling.textContent='🍽️'; console.log('❌ Image failed to load:', imageSrc);">
                 <div class="fallback-icon" style="display: none;">🍽️</div>` :
                '<div class="fallback-icon">🍽️</div>'
            }
        </div>
        <div class="food-content">
            <h3 class="food-title">
                <i class="fas fa-utensils"></i>
                ${food.title}
            </h3>
            <div class="food-details">
                <div class="food-detail">
                    <i class="fas fa-globe"></i>
                    <span>${country}</span>
                </div>
                <div class="food-detail">
                    <i class="fas fa-dollar-sign"></i>
                    <span>${price}</span>
                </div>
                <div class="food-detail">
                    <i class="fas fa-star"></i>
                    <span>${score}</span>
                </div>
            </div>
            <div class="food-actions">
                <a href="../Ben/FoodInfo.html?food=${encodeURIComponent(food.title)}" class="btn btn-primary">
                    <i class="fas fa-info-circle"></i>
                    View Details
                </a>
                <a href="../JY/Recipe.html?food=${encodeURIComponent(food.title)}" class="btn btn-secondary">
                    <i class="fas fa-utensils"></i>
                    View Recipe
                </a>
            </div>
        </div>
    `;
    
    return foodCard;
}

// Get food data from shared data
function getFoodData(foodTitle) {
    if (window.SiteData && window.SiteData.foods) {
        const foundFood = window.SiteData.foods.find(food => 
            food.title.toLowerCase() === foodTitle.toLowerCase()
        );
        
        if (foundFood) {
            console.log('✅ Found food data for:', foodTitle, foundFood);
            return foundFood;
        } else {
            console.log('⚠️ Food not found in shared data:', foodTitle);
        }
    } else {
        console.log('❌ Shared data not available');
    }
    return null;
}

// Setup clear button functionality
function setupClearButton() {
    const clearButton = document.createElement('button');
    clearButton.className = 'clear-button animate__animated animate__fadeIn';
    clearButton.innerHTML = `
        <i class="fas fa-trash"></i>
        Clear Recently Viewed
    `;
    
    clearButton.addEventListener('click', function() {
        if (confirm('Are you sure you want to clear all recently viewed foods? This action cannot be undone.')) {
            clearRecentlyViewed();
        }
    });
    
    // Insert at the beginning of content container
    const contentContainer = document.getElementById('recently-viewed-content');
    if (contentContainer) {
        contentContainer.insertBefore(clearButton, contentContainer.firstChild);
    }
}

// Clear recently viewed foods
function clearRecentlyViewed() {
    sessionStorage.removeItem('recentlyViewed');
    
    // Show success message
    showNotification('Recently viewed foods cleared successfully!', 'success');
    
    // Reload the page content
    setTimeout(() => {
        loadRecentlyViewedFoods();
    }, 1000);
}

// Add animations to elements
function addAnimations() {
    const cards = document.querySelectorAll('.food-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type} animate__animated animate__fadeInDown`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#17a2b8'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('animate__fadeInDown');
        notification.classList.add('animate__fadeOutUp');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    }, 3000);
}

// Export functions for global access
window.recentlyViewedFunctions = {
    loadRecentlyViewedFoods,
    clearRecentlyViewed,
    showNotification
};

// Manual trigger for debugging
window.debugRecentlyViewed = function() {
    console.log('=== Debug Recently Viewed ===');
    console.log('Session Storage:', sessionStorage.getItem('recentlyViewed'));
    console.log('SiteData available:', !!window.SiteData);
    if (window.SiteData) {
        console.log('Foods count:', window.SiteData.foods.length);
        console.log('Sample foods:', window.SiteData.foods.slice(0, 3));
    }
    console.log('Content container:', document.getElementById('recently-viewed-content'));
    console.log('Empty state:', document.getElementById('empty-state'));
};

// Force reload with shared data
window.forceReloadWithData = function() {
    console.log('🔄 Force reloading with shared data...');
    if (window.SiteData && window.SiteData.foods) {
        loadRecentlyViewedFoods();
    } else {
        console.log('❌ Shared data still not available');
    }
};

// Test image loading for debugging
window.testImagePaths = function() {
    console.log('🧪 Testing image paths...');
    if (window.SiteData && window.SiteData.foods) {
        const sampleFood = window.SiteData.foods[0];
        if (sampleFood && sampleFood.images) {
            let originalPath = '';
            if (Array.isArray(sampleFood.images)) {
                originalPath = sampleFood.images[0];
            } else if (sampleFood.images.cover) {
                originalPath = sampleFood.images.cover;
            }
            
            if (originalPath) {
                console.log('📁 Original image path:', originalPath);
                
                // Test path resolution
                let resolvedPath = originalPath;
                if (resolvedPath && !resolvedPath.startsWith('http') && !resolvedPath.startsWith('data:')) {
                    if (resolvedPath.includes('street food/picture/')) {
                        resolvedPath = '../' + resolvedPath;
                    } else if (resolvedPath.startsWith('../street food/')) {
                        resolvedPath = resolvedPath;
                    } else if (resolvedPath.startsWith('./')) {
                        resolvedPath = '../street food/' + resolvedPath.substring(2);
                    } else {
                        resolvedPath = '../street food/picture/' + resolvedPath;
                    }
                }
                console.log('🔧 Resolved path:', resolvedPath);
                console.log('📍 Full URL:', window.location.origin + window.location.pathname.replace('/Ben/recently-viewed.html', '') + '/' + resolvedPath);
            }
        }
    }
};
