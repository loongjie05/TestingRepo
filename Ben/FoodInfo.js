// Use unified dataset
const foodList = (window.SiteData && window.SiteData.foods) ? window.SiteData.foods : [];
// Map minimal fields for this page (keeping extended tabs empty for now)
const foodData = {};
foodList.forEach(item => {
    foodData[item.title] = {
        image: item.images?.cover || '',
        country: item.country,
        category: item.type,
        price: item.price,
        description: item.description || '',
        history: {
            background: item.description || '',
            origin: ''
        },
        ingredients: {
            main: (item.ingredients ? String(item.ingredients).split('•').map(s=>s.trim()).filter(Boolean) : []),
            spices: []
        },
        nutrition: {
            calories: '', protein: '', carbs: '', fat: ''
        },
        healthBenefits: '',
        culture: {
            significance: '', occasions: '', bestPlaces: ''
        }
    };
});

// DOM Elements
const foodGrid = document.getElementById('foodGrid');
const foodDetails = document.getElementById('foodDetails');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadFoodGrid();
    // Auto-select food from ?food=
    const params = new URLSearchParams(window.location.search);
    const foodParam = params.get('food');
    if (foodParam && foodData[foodParam]) {
        // Find the card and simulate click to ensure UI states update
        const cards = document.querySelectorAll('.food-card h3');
        for (const h3 of cards) {
            if (h3.textContent.trim() === foodParam) {
                h3.parentElement.click();
                break;
            }
        }
        // Fallback direct select
        if (!document.getElementById('foodName').textContent) {
            selectFood(foodParam);
        }
    }
    setupTabSwitching();
    // Setup favourite toggle for details view
    const favEl = document.getElementById('foodFavHeart');
    if (favEl) {
        const getFavs = () => { try { return JSON.parse(localStorage.getItem('favourites') || '[]'); } catch(e){ return []; } };
        const setFavs = (arr) => localStorage.setItem('favourites', JSON.stringify(arr));
        const updateUi = (title) => {
            const favs = getFavs();
            if (title && favs.includes(title)) favEl.classList.add('saved'); else favEl.classList.remove('saved');
        };
        favEl.addEventListener('click', () => {
            const currentTitle = document.getElementById('foodName').textContent;
            if (!currentTitle) return;
            const favs = getFavs();
            const idx = favs.indexOf(currentTitle);
            if (idx === -1) favs.push(currentTitle); else favs.splice(idx, 1);
            setFavs(favs);
            updateUi(currentTitle);
        });
        // Initialize once
        const initTitle = document.getElementById('foodName').textContent;
        updateUi(initTitle);
    }

    // Hero image favourite toggle mirrors the main one
    const heroFav = document.getElementById('foodHeroFavHeart');
    if (heroFav) {
        const getFavs = () => { try { return JSON.parse(localStorage.getItem('favourites') || '[]'); } catch(e){ return []; } };
        const setFavs = (arr) => localStorage.setItem('favourites', JSON.stringify(arr));
        const updateUi = (title) => {
            const favs = getFavs();
            if (title && favs.includes(title)) heroFav.classList.add('saved'); else heroFav.classList.remove('saved');
        };
        heroFav.addEventListener('click', () => {
            const currentTitle = document.getElementById('foodName').textContent;
            if (!currentTitle) return;
            const favs = getFavs();
            const idx = favs.indexOf(currentTitle);
            if (idx === -1) favs.push(currentTitle); else favs.splice(idx, 1);
            setFavs(favs);
            updateUi(currentTitle);
            // sync the image heart too
            const imgFav = document.getElementById('foodFavHeart');
            if (imgFav) {
                if (favs.includes(currentTitle)) imgFav.classList.add('saved'); else imgFav.classList.remove('saved');
            }
        });
        const initTitle = document.getElementById('foodName').textContent;
        updateUi(initTitle);
    }
});

// Load food grid
function loadFoodGrid() {
    foodGrid.innerHTML = '';
    
    Object.keys(foodData).forEach(foodName => {
        const food = foodData[foodName];
        const foodCard = document.createElement('div');
        foodCard.className = 'food-card';
        foodCard.innerHTML = `
            <img src="${food.image}" alt="${foodName}" onerror="this.src='../LJ/pictures/cooking.jpg'">
            <h3>${foodName}</h3>
            <div class="country">
                <i class="fa-solid fa-flag"></i>
                ${food.country}
            </div>
        `;
        
        foodCard.addEventListener('click', () => selectFood(foodName, foodCard));
        foodGrid.appendChild(foodCard);
    });
}

// Select food and show details
function selectFood(foodName, sourceElement) {
    const food = foodData[foodName];
    
    // Update selected card
    document.querySelectorAll('.food-card').forEach(card => {
        card.classList.remove('selected');
    });
    if (sourceElement) {
        sourceElement.classList.add('selected');
    } else {
        const match = Array.from(document.querySelectorAll('.food-card'))
            .find(c => (c.querySelector('h3')?.textContent || '').trim() === foodName);
        if (match) match.classList.add('selected');
    }
    
    // Update food details
    const imgEl = document.getElementById('foodImage');
    const heroImgEl = document.getElementById('heroFoodImage');
    imgEl.onerror = function(){ this.src = '../LJ/pictures/cooking.jpg'; };
    imgEl.src = food.image || '../LJ/pictures/cooking.jpg';
    if (heroImgEl) { heroImgEl.onerror = function(){ this.src = '../LJ/pictures/cooking.jpg'; }; heroImgEl.src = imgEl.src; }
    document.getElementById('foodName').textContent = foodName;
    document.getElementById('foodCountry').textContent = food.country;
    document.getElementById('foodCategory').textContent = food.category;
    document.getElementById('foodPrice').textContent = food.price;
    document.getElementById('foodDescription').textContent = food.description;
    // Update favourite UI after selecting a food
    (function(){
        const favEl = document.getElementById('foodFavHeart');
        if (!favEl) return;
        const getFavs = () => { try { return JSON.parse(localStorage.getItem('favourites') || '[]'); } catch(e){ return []; } };
        const favs = getFavs();
        if (favs.includes(foodName)) favEl.classList.add('saved'); else favEl.classList.remove('saved');
        const heroFav = document.getElementById('foodHeroFavHeart');
        if (heroFav) { if (favs.includes(foodName)) heroFav.classList.add('saved'); else heroFav.classList.remove('saved'); }
    })();
    
    // Set recipe button deep link to specific recipe
    const recipeBtn = document.getElementById('recipeBtn');
    if (recipeBtn) {
        recipeBtn.setAttribute('href', `../JY/Recipe.html?food=${encodeURIComponent(foodName)}`);
    }

    // Update history tab
    document.getElementById('historyContent').textContent = food.history.background;
    document.getElementById('originContent').textContent = food.history.origin;
    
    // Update ingredients tab
    const mainIngredientsList = document.getElementById('mainIngredients');
    const spicesIngredientsList = document.getElementById('spicesIngredients');
    
    mainIngredientsList.innerHTML = food.ingredients.main.map(ingredient => 
        `<li>${ingredient}</li>`
    ).join('');
    
    spicesIngredientsList.innerHTML = food.ingredients.spices.map(spice => 
        `<li>${spice}</li>`
    ).join('');
    
    // Update nutrition tab
    document.getElementById('calories').textContent = food.nutrition.calories;
    document.getElementById('protein').textContent = food.nutrition.protein;
    document.getElementById('carbs').textContent = food.nutrition.carbs;
    document.getElementById('fat').textContent = food.nutrition.fat;
    document.getElementById('healthBenefits').textContent = food.healthBenefits;
    
    // Update culture tab
    document.getElementById('culturalSignificance').textContent = food.culture.significance;
    document.getElementById('eatingOccasions').textContent = food.culture.occasions;
    document.getElementById('bestPlaces').textContent = food.culture.bestPlaces;
    
    // Show details section
    foodDetails.style.display = 'block';
    
    // Scroll to details
    foodDetails.scrollIntoView({ behavior: 'smooth' });
}

// Setup tab switching
function setupTabSwitching() {
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Handle image loading errors
function handleImageError(img) {
    img.src = '../LJ/pictures/cooking.jpg';
}
