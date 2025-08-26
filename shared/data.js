// Centralized site data accessible via window.SiteData
window.SiteData = window.SiteData || {};

// Build unified foods list from Recipe.js and Street Food pages if available
// and fall back to existing list if those are not loaded yet.
(function(){
    // Static fallback so pages work even if Recipe/StreetFood scripts are not loaded
    const baseList = [
        { title: "Nasi Lemak", images: { cover: "../street food/picture/NasiLemak1.webp" }, country: "Malaysia", continent: "Asia", type: "Rice", price: "RM8 - RM15", description: "A fragrant rice dish cooked in coconut milk, served with sambal and sides.", ingredients: "Rice • Coconut milk • Sambal • Anchovies • Peanuts • Egg", score: 9.5 },
        { title: "Mango Sticky Rice", images: { cover: "../street food/picture/MangoRice1.jpg" }, country: "Thailand", continent: "Asia", type: "Dessert", price: "฿60 - ฿120", description: "Sweet sticky rice with coconut milk, topped with ripe mango.", ingredients: "Glutinous rice • Coconut milk • Mango • Sugar • Salt", score: 9.0 },
        { title: "Taco", images: { cover: "../street food/picture/Taco1.jpg" }, country: "Mexico", continent: "North America", type: "Bread", price: "$3 - $8", description: "Corn or wheat tortilla folded around tasty fillings.", ingredients: "Tortilla • Meat • Salsa • Onion • Cilantro", score: 8.8 },
        { title: "Churros", images: { cover: "../street food/picture/Churros1.webp" }, country: "Spain", continent: "Europe", type: "Pastry", price: "€2 - €5", description: "Fried-dough pastry dusted with sugar, often dipped in chocolate.", ingredients: "Flour • Water • Sugar • Oil • Cinnamon", score: 8.6 },
        { title: "Bunny Chow", images: { cover: "../street food/picture/BunnyChow1.webp" }, country: "South Africa", continent: "Africa", type: "Bread", price: "R40 - R80", description: "Hollowed-out bread loaf filled with curry.", ingredients: "Bread • Curry • Spices • Vegetables", score: 8.7 },
        { title: "Meat Pie", images: { cover: "../street food/picture/MeatPie1.jpg" }, country: "Australia", continent: "Oceania", type: "Pastry", price: "$4 - $9", description: "Savory pie filled with minced meat and gravy.", ingredients: "Pastry • Minced meat • Gravy • Onion", score: 8.4 },
        { title: "Arepas", images: { cover: "../street food/picture/Arepas1.jpg" }, country: "Venezuela", continent: "South America", type: "Bread", price: "$3 - $7", description: "Cornmeal cakes split and stuffed with fillings.", ingredients: "Cornmeal • Cheese • Meat • Avocado", score: 8.5 },
        { title: "Pad Thai", images: { cover: "../street food/picture/PadThai1.webp" }, country: "Thailand", continent: "Asia", type: "Noodles", price: "฿60 - ฿120", description: "Stir-fried rice noodle dish with a sweet-savory sauce.", ingredients: "Rice noodles • Tamarind • Egg • Tofu • Shrimp", score: 9.1 },
        { title: "Falafel", images: { cover: "../street food/picture/Falafel1.jpg" }, country: "Middle East", continent: "Asia", type: "Snack", price: "$4 - $10", description: "Deep-fried balls made from ground chickpeas or fava beans.", ingredients: "Chickpeas • Herbs • Spices • Oil", score: 8.3 },
        { title: "Satay", images: { cover: "../street food/picture/Satay1.avif" }, country: "Malaysia", continent: "Asia", type: "Skewers", price: "RM1.5 - RM2/stick", description: "Skewered and grilled meat served with peanut sauce.", ingredients: "Meat • Spices • Peanut sauce • Cucumber • Onion", score: 9.2 },
        { title: "Poutine", images: { cover: "../street food/picture/Poutine1.jpg" }, country: "Canada", continent: "North America", type: "Snack", price: "$6 - $12", description: "French fries topped with cheese curds and hot gravy.", ingredients: "Fries • Cheese curds • Gravy", score: 8.2 },
        { title: "Jerk Chicken", images: { cover: "../street food/picture/JerkChicken1.jpg" }, country: "Jamaica", continent: "North America", type: "Meat", price: "$8 - $15", description: "Chicken marinated with spicy jerk seasoning and grilled.", ingredients: "Chicken • Scotch bonnet • Allspice • Herbs", score: 8.9 },
        { title: "Takoyaki", images: { cover: "../street food/picture/Takoyaki1.avif" }, country: "Japan", continent: "Asia", type: "Snack", price: "¥400 - ¥800", description: "Ball-shaped wheat batter filled with octopus and toppings.", ingredients: "Batter • Octopus • Tempura scraps • Pickled ginger • Scallion", score: 8.5 },
        { title: "Empanadas", images: { cover: "../street food/picture/Empanadas1.webp" }, country: "Argentina", continent: "South America", type: "Pastry", price: "$2 - $5", description: "Baked or fried pastry stuffed with savory fillings.", ingredients: "Pastry • Beef • Onion • Spices", score: 8.6 }
    ];
    function fromRecipeFoods(){
        try {
            if (!Array.isArray(window.RecipeFoods)) return [];
            return window.RecipeFoods.map(f => ({
                title: f.title,
                images: { cover: f.img },
                country: (f.tags || []).slice(-1)[0] || '',
                continent: f.continent || '',
                type: f.type || '',
                price: '',
                description: '',
                ingredients: '',
                score: 8.0
            }));
        } catch(e){ return []; }
    }

    function fromStreetFoodPages(){
        try {
            if (!Array.isArray(window.StreetFoodPages)) return [];
            return window.StreetFoodPages.map(p => ({
                title: p.food?.title || '',
                images: { cover: `../street food/${p.food?.img || ''}` },
                country: '',
                continent: '',
                type: '',
                price: '',
                description: p.food?.text || '',
                ingredients: p.ingredients?.p1 || '',
                score: 8.0
            }));
        } catch(e){ return []; }
    }

    const aggregated = []
        .concat(fromRecipeFoods())
        .concat(fromStreetFoodPages())
        .filter(item => item && item.title);

    // Merge aggregated over baseList by title (prefer aggregated fields when present)
    const byTitle = new Map();
    baseList.forEach(item => byTitle.set(item.title, item));
    aggregated.forEach(item => {
        const existing = byTitle.get(item.title) || {};
        byTitle.set(item.title, Object.assign({}, existing, item));
    });

    window.SiteData.foods = Array.from(byTitle.values());
})();


