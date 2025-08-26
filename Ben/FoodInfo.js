// Create comprehensive image mapping using ONLY street food pictures
const foodImageMap = {
    // Malaysian Foods
    "Nasi Lemak": "../street food/picture/NasiLemak1.webp",
    "Laksa": "../street food/picture/Laksa1.jpg",
    "Char Kway Teow": "../street food/picture/CharKwayTeow1.jpg",
    "Roti Canai": "../street food/picture/RotiCanai1.jpg",
    "Nasi Kandar": "../street food/picture/NasiKandar1.jpg",
    "Hokkien Mee": "../street food/picture/HokkienMee1.jpg",
    "Cendol": "../street food/picture/Cendol1.webp", 
    "Asam Laksa": "../street food/picture/Laksa2.jpg", // Different laksa image
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

// Comprehensive food data with detailed information
const comprehensiveFoodData = {
    "Nasi Lemak": {
        history: {
            background: "Malaysia's beloved national dish, Nasi Lemak originated from humble beginnings as a farmer's breakfast. The fragrant coconut rice was designed to provide sustained energy for long working days in the fields.",
            origin: "First documented in the early 1900s in rural Malaysia, though likely existed centuries earlier as a Malay village staple."
        },
        ingredients: {
            main: ["Coconut rice", "Sambal (chili paste)", "Fried anchovies", "Roasted peanuts", "Hard-boiled egg", "Cucumber slices"],
            spices: ["Chili peppers", "Shallots", "Garlic", "Belacan (shrimp paste)", "Tamarind", "Palm sugar"]
        },
        nutrition: {
            calories: "450-650 kcal",
            protein: "15-20g",
            carbs: "60-80g",
            fat: "18-25g"
        },
        healthBenefits: "Rich in protein from anchovies and eggs, provides complex carbohydrates for energy, contains antioxidants from chili peppers, and healthy fats from coconut milk.",
        culture: {
            significance: "Considered Malaysia's national dish and a symbol of cultural unity, representing the harmony of Malay culinary traditions.",
            occasions: "Traditionally eaten for breakfast, but now enjoyed throughout the day. Essential at festive occasions and family gatherings.",
            bestPlaces: "Village Kopitiam stalls in Kuala Lumpur, traditional Malay restaurants in Penang, and street food centers across Malaysia."
        }
    },
    
    "Mango Sticky Rice": {
        history: {
            background: "This iconic Thai dessert has been a cornerstone of Southeast Asian cuisine for over 300 years, originally created by Buddhist monks who combined locally grown mangoes with glutinous rice.",
            origin: "Originated in Thai monasteries during the Ayutthaya period (1351-1767), later becoming a royal court delicacy."
        },
        ingredients: {
            main: ["Glutinous rice", "Fresh mango", "Coconut milk", "Palm sugar", "Salt"],
            spices: ["Pandan leaves", "Vanilla", "Palm sugar"]
        },
        nutrition: {
            calories: "320-450 kcal",
            protein: "4-6g",
            carbs: "65-85g",
            fat: "8-12g"
        },
        healthBenefits: "High in vitamin C and beta-carotene from mangoes, provides quick energy from natural sugars, contains healthy fats from coconut milk.",
        culture: {
            significance: "Represents prosperity and good fortune in Thai culture, often served during religious ceremonies and celebrations.",
            occasions: "Popular during mango season (March-June), Buddhist festivals, and as a refreshing summer dessert.",
            bestPlaces: "Chatuchak Weekend Market in Bangkok, floating markets in Amphawa, traditional Thai restaurants worldwide."
        }
    },
    
    "Taco": {
        history: {
            background: "Tacos trace their roots to pre-Hispanic Mexico, where indigenous peoples used corn tortillas as edible plates. Spanish colonization introduced new ingredients, creating the modern taco.",
            origin: "Archaeological evidence suggests tacos existed before the Spanish arrival in 1519, with corn tortillas being used by Aztecs and other Mesoamerican civilizations."
        },
        ingredients: {
            main: ["Corn or flour tortilla", "Meat (beef, pork, chicken, fish)", "Onions", "Cilantro", "Lime"],
            spices: ["Cumin", "Chili powder", "Paprika", "Oregano", "Garlic powder"]
        },
        nutrition: {
            calories: "150-300 kcal per taco",
            protein: "8-15g",
            carbs: "15-25g",
            fat: "5-15g"
        },
        healthBenefits: "Good source of protein, contains fiber from corn tortillas, provides vitamin C from lime and cilantro, can be made with lean meats for lower fat content.",
        culture: {
            significance: "Central to Mexican identity and cuisine, represents the fusion of indigenous and Spanish culinary traditions.",
            occasions: "Eaten daily as street food, essential at celebrations, festivals, and family gatherings throughout Mexico and beyond.",
            bestPlaces: "Street vendors in Mexico City, taquerias in Guadalajara, food trucks in Los Angeles, authentic Mexican restaurants globally."
        }
    },
    
    "Churros": {
        history: {
            background: "Churros were likely brought to Spain by Portuguese traders who encountered similar fried dough in China. Spanish shepherds perfected the recipe, making it a beloved treat across the Spanish empire.",
            origin: "First appeared in Spain in the 16th century, though similar fried dough existed in ancient China and the Middle East."
        },
        ingredients: {
            main: ["Flour", "Water", "Salt", "Oil for frying", "Sugar", "Cinnamon"],
            spices: ["Cinnamon", "Vanilla extract", "Lemon zest"]
        },
        nutrition: {
            calories: "200-350 kcal per serving",
            protein: "3-5g",
            carbs: "30-45g",
            fat: "12-20g"
        },
        healthBenefits: "Provides quick energy from carbohydrates, contains small amounts of iron from flour, best enjoyed in moderation as an occasional treat.",
        culture: {
            significance: "Iconic Spanish pastry that spread throughout Latin America, representing Spanish colonial culinary influence.",
            occasions: "Traditional breakfast item with hot chocolate, popular at festivals, fairs, and as an afternoon snack.",
            bestPlaces: "Chocolatería San Ginés in Madrid, street vendors in Barcelona, Mexican panaderías, Spanish bakeries worldwide."
        }
    },
    
    "Ramen": {
        history: {
            background: "Ramen evolved from Chinese lamian noodles brought to Japan in the early 20th century. Each region developed its own style, creating the diverse ramen culture we know today.",
            origin: "First ramen shop opened in Yokohama in 1910, but modern ramen culture exploded after WWII as an affordable, filling meal."
        },
        ingredients: {
            main: ["Wheat noodles", "Pork or chicken broth", "Chashu pork", "Green onions", "Nori seaweed", "Soft-boiled egg"],
            spices: ["Miso", "Soy sauce", "Garlic", "Ginger", "White pepper"]
        },
        nutrition: {
            calories: "400-600 kcal",
            protein: "20-30g",
            carbs: "45-65g",
            fat: "15-25g"
        },
        healthBenefits: "High protein content from meat and eggs, provides B vitamins from broth, contains minerals from seaweed, comfort food that can boost mood.",
        culture: {
            significance: "Represents Japanese innovation and adaptation of foreign cuisine, central to Japanese comfort food culture.",
            occasions: "Popular as a quick lunch, late-night meal, comfort food during cold weather, and social dining experience.",
            bestPlaces: "Ramen shops in Tokyo's Shibuya district, Ichiran and Ippudo chains, local ramen-ya across Japan, specialty ramen restaurants worldwide."
        }
    }
};

// Use unified dataset
const foodList = (window.SiteData && window.SiteData.foods) ? window.SiteData.foods : [];
// Map minimal fields for this page with proper image mapping and comprehensive data
const foodData = {};
foodList.forEach(item => {
    const foodName = item.title;
    const mappedImage = foodImageMap[foodName] || item.images?.cover || '../LJ/pictures/cooking.jpg';
    const comprehensive = comprehensiveFoodData[foodName] || {};
    
    foodData[foodName] = {
        image: mappedImage,
        country: item.country,
        category: item.type,
        price: item.price,
        description: item.description || '',
        history: {
            background: comprehensive.history?.background || item.description || 'This delicious dish has a rich culinary heritage and continues to be enjoyed by food lovers around the world.',
            origin: comprehensive.history?.origin || 'Traditional recipe passed down through generations.'
        },
        ingredients: {
            main: comprehensive.ingredients?.main || (item.ingredients ? String(item.ingredients).split('•').map(s=>s.trim()).filter(Boolean) : ['Traditional ingredients', 'Local spices', 'Fresh herbs']),
            spices: comprehensive.ingredients?.spices || ['Regional spices', 'Aromatic herbs', 'Traditional seasonings']
        },
        nutrition: {
            calories: comprehensive.nutrition?.calories || '250-400 kcal',
            protein: comprehensive.nutrition?.protein || '10-20g',
            carbs: comprehensive.nutrition?.carbs || '30-50g',
            fat: comprehensive.nutrition?.fat || '8-15g'
        },
        healthBenefits: comprehensive.healthBenefits || 'Provides essential nutrients, supports a balanced diet, and offers cultural culinary experience. Contains vitamins and minerals from fresh ingredients.',
        culture: {
            significance: comprehensive.culture?.significance || 'An important dish in its regional cuisine, representing local culinary traditions and cultural heritage.',
            occasions: comprehensive.culture?.occasions || 'Enjoyed during family meals, celebrations, and cultural festivals. Popular as both everyday food and special occasion dish.',
            bestPlaces: comprehensive.culture?.bestPlaces || 'Traditional restaurants, local food markets, authentic establishments, and homes where family recipes are preserved.'
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
    // Initialize AOS animations if available
    try { if (window.AOS && AOS.init) AOS.init({ once: true, duration: 600, easing: 'ease-out' }); } catch(e) {}
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

    // Removed hero favourite heart
});

// Load food grid
function loadFoodGrid() {
    foodGrid.innerHTML = '';
    
    Object.keys(foodData).forEach(foodName => {
        const food = foodData[foodName];
        const foodCard = document.createElement('div');
        foodCard.className = 'food-card';
        foodCard.innerHTML = `
            <div class="img-wrap">
                <img src="${food.image}" alt="${foodName}" onerror="this.src='../LJ/pictures/cooking.jpg'">
                <span class="fav-heart" data-food="${foodName}" title="Toggle favourite" aria-label="Toggle favourite">
                    <i class="fa-solid fa-heart"></i>
                </span>
            </div>
            <h3>${foodName}</h3>
            <div class="country">
                <i class="fa-solid fa-flag"></i>
                ${food.country}
            </div>
        `;

        // Card click selects food
        foodCard.addEventListener('click', (e) => {
            // Avoid triggering select when clicking heart
            if ((e.target.closest && e.target.closest('.fav-heart'))) return;
            selectFood(foodName, foodCard);
        });

        // Heart toggle per card
        const heart = foodCard.querySelector('.fav-heart');
        if (heart){
            const getFavs = () => { try { return JSON.parse(localStorage.getItem('favourites') || '[]'); } catch(e){ return []; } };
            const setFavs = (arr) => localStorage.setItem('favourites', JSON.stringify(arr));
            const syncSaved = () => {
                const favs = getFavs();
                if (favs.includes(foodName)) heart.classList.add('saved'); else heart.classList.remove('saved');
            };
            syncSaved();
            heart.addEventListener('click', (e) => {
                e.stopPropagation();
                const favs = getFavs();
                const idx = favs.indexOf(foodName);
                if (idx === -1) favs.push(foodName); else favs.splice(idx, 1);
                setFavs(favs);
                syncSaved();
            });
        }

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
        recipeBtn.setAttribute('href', `../street food/Food.html?title=${encodeURIComponent(foodName)}`);
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
