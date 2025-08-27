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
        { title: "Empanadas", images: { cover: "../street food/picture/Empanadas1.webp" }, country: "Argentina", continent: "South America", type: "Pastry", price: "$2 - $5", description: "Baked or fried pastry stuffed with savory fillings.", ingredients: "Pastry • Beef • Onion • Spices", score: 8.6 },
        { title: "Dumplings", images: { cover: "../street food/picture/Dumplings1.jpg" }, country: "China", continent: "Asia", type: "Dough", price: "¥20 - ¥50", description: "Steamed or fried dough wrappers with various fillings.", ingredients: "Flour • Meat • Vegetables • Soy sauce", score: 8.7 }
    ];

    // Augment base list to ensure at least 10 per continent and 10 for Malaysia
    (function ensureMinimumCounts(){
        const placeholderImg = "../LJ/pictures/cooking.jpg";
        const byTitle = new Set(baseList.map(i => i.title));

        const malaysiaExtras = [
            { title: "Laksa", country: "Malaysia", continent: "Asia", type: "Noodles", price: "RM8 - RM15", description: "Spicy noodle soup with coconut or tamarind base.", ingredients: "Noodles • Coconut milk • Sambal • Shrimp • Fish cake", score: 9.0, images: { cover: "../street food/picture/Laksa1.jpg" } },
            { title: "Char Kway Teow", country: "Malaysia", continent: "Asia", type: "Noodles", price: "RM7 - RM14", description: "Stir-fried flat rice noodles with soy and chili.", ingredients: "Flat noodles • Soy sauce • Egg • Chives • Prawns", score: 9.1, images: { cover: "../street food/picture/CharKwayTeow1.jpg" } },
            { title: "Roti Canai", country: "Malaysia", continent: "Asia", type: "Bread", price: "RM2 - RM6", description: "Flaky flatbread served with dhal or curry.", ingredients: "Flour • Ghee • Salt • Water", score: 8.8, images: { cover: "../street food/picture/RotiCanai1.jpg" } },
            { title: "Nasi Kandar", country: "Malaysia", continent: "Asia", type: "Rice", price: "RM10 - RM20", description: "Steamed rice with assorted curries.", ingredients: "Rice • Curries • Fried chicken • Okra", score: 9.0, images: { cover: "../street food/picture/NasiKandar1.jpg" } },
            { title: "Hokkien Mee", country: "Malaysia", continent: "Asia", type: "Noodles", price: "RM8 - RM15", description: "Thick noodles braised in dark soy.", ingredients: "Yellow noodles • Dark soy • Pork • Cabbage", score: 8.7, images: { cover: "../street food/picture/HokkienMee1.jpg" } },
            { title: "Cendol", country: "Malaysia", continent: "Asia", type: "Dessert", price: "RM3 - RM8", description: "Shaved ice dessert with coconut milk and palm sugar.", ingredients: "Coconut milk • Palm sugar • Pandan jelly • Beans", score: 8.6, images: { cover: "../street food/picture/Cendol1.webp" } },
            { title: "Asam Laksa", country: "Malaysia", continent: "Asia", type: "Noodles", price: "RM8 - RM15", description: "Tamarind-based fish broth noodle soup.", ingredients: "Mackerel • Tamarind • Noodles • Mint", score: 9.0, images: { cover: "../street food/picture/Laksa2.jpg" } },
            { title: "Nasi Kerabu", country: "Malaysia", continent: "Asia", type: "Rice", price: "RM8 - RM18", description: "Blue rice with herbs and fish.", ingredients: "Rice • Butterfly pea • Herbs • Fish floss", score: 8.9, images: { cover: "../street food/picture/NasiKerabu1.jpg" } },
            { title: "Rojak", country: "Malaysia", continent: "Asia", type: "Salad", price: "RM6 - RM12", description: "Fruit and vegetable salad with peanut sauce.", ingredients: "Pineapple • Cucumber • Jicama • Peanut sauce", score: 8.4, images: { cover: "../street food/picture/Rojak1.jpg" } }
        ];

        const asiaExtras = [
            { title: "Sushi", country: "Japan", continent: "Asia", type: "Rice", price: "¥100 - ¥800/pc", description: "Vinegared rice with seafood and vegetables.", ingredients: "Rice • Nori • Fish • Soy sauce • Wasabi", score: 9.2, images: { cover: "../street food/picture/Sushi1.webp" } },
            { title: "Biryani", country: "India", continent: "Asia", type: "Rice", price: "₹150 - ₹400", description: "Aromatic spiced rice with meat or vegetables.", ingredients: "Basmati • Spices • Meat • Ghee", score: 9.0, images: { cover: "../street food/picture/Biryani1.jpg" } },
            { title: "Pho", country: "Vietnam", continent: "Asia", type: "Soup", price: "₫30,000 - ₫80,000", description: "Broth with rice noodles, herbs, and beef or chicken.", ingredients: "Beef bones • Rice noodles • Herbs", score: 9.0, images: { cover: "../street food/picture/Pho1.webp" } },
            { title: "Tom Yum", country: "Thailand", continent: "Asia", type: "Soup", price: "฿60 - ฿150", description: "Hot and sour soup with lemongrass and shrimp.", ingredients: "Lemongrass • Lime • Chili • Shrimp", score: 8.8, images: { cover: "../street food/picture/TomYum1.jpg" } },
            { title: "Ramen", country: "Japan", continent: "Asia", type: "Noodles", price: "¥600 - ¥1200", description: "Wheat noodles in rich broth with toppings.", ingredients: "Noodles • Broth • Pork • Egg", score: 9.0, images: { cover: "../street food/picture/Ramen1.jpg" } },
            { title: "Peking Duck", country: "China", continent: "Asia", type: "Meat", price: "¥80 - ¥200", description: "Crispy roasted duck served with pancakes.", ingredients: "Duck • Hoisin • Scallions", score: 9.1, images: { cover: "../street food/picture/PekingDuck1.jpg" } }
        ];

        const europeExtras = [
            { title: "Fish and Chips", country: "United Kingdom", continent: "Europe", type: "Snack", price: "£6 - £12", description: "Battered fried fish with chips.", ingredients: "Fish • Potato • Batter", score: 8.7, images: { cover: "../street food/picture/FishAndChips1.webp" } },
            { title: "Paella", country: "Spain", continent: "Europe", type: "Rice", price: "€10 - €20", description: "Saffron rice with seafood or meat.", ingredients: "Rice • Saffron • Seafood • Chicken", score: 8.9, images: { cover: "../street food/picture/Paella1.jpg" } },
            { title: "Pizza Margherita", country: "Italy", continent: "Europe", type: "Bread", price: "€6 - €12", description: "Tomato, mozzarella, and basil pizza.", ingredients: "Flour • Tomato • Mozzarella • Basil", score: 9.1, images: { cover: "../street food/picture/PizzaMargherita1.webp" } },
            { title: "Gyro", country: "Greece", continent: "Europe", type: "Meat", price: "€3 - €6", description: "Spit-roasted meat in pita with tzatziki.", ingredients: "Pita • Pork/Chicken • Tzatziki", score: 8.6, images: { cover: "../street food/picture/Gyro1.webp" } },
            { title: "Pierogi", country: "Poland", continent: "Europe", type: "Dumpling", price: "zł8 - zł20", description: "Stuffed dumplings boiled or fried.", ingredients: "Flour • Potato • Cheese", score: 8.5, images: { cover: "../street food/picture/Pierogi1.jpg" } },
            { title: "Goulash", country: "Hungary", continent: "Europe", type: "Stew", price: "€6 - €12", description: "Beef stew with paprika.", ingredients: "Beef • Paprika • Onion", score: 8.6, images: { cover: "../street food/picture/Goulash1.jpg" } },
            { title: "Bratwurst", country: "Germany", continent: "Europe", type: "Sausage", price: "€3 - €6", description: "Grilled sausage served in a roll.", ingredients: "Pork • Spices • Bun", score: 8.4, images: { cover: "../street food/picture/Bratwurst1.jpg" } },
            { title: "Crêpes", country: "France", continent: "Europe", type: "Pastry", price: "€3 - €8", description: "Thin pancakes with various fillings.", ingredients: "Flour • Egg • Milk", score: 8.5, images: { cover: "../street food/picture/Crêpes1.jpg" } },
            { title: "Doner Kebab", country: "Turkey", continent: "Europe", type: "Meat", price: "€4 - €7", description: "Vertically roasted meat in flatbread.", ingredients: "Lamb/Chicken • Flatbread • Salad", score: 8.8, images: { cover: "../street food/picture/DonerKebab1.jpg" } }
        ];

        const naExtras = [
            { title: "Hamburger", country: "United States", continent: "North America", type: "Sandwich", price: "$4 - $12", description: "Beef patty in a bun with toppings.", ingredients: "Beef • Bun • Lettuce • Tomato", score: 8.8, images: { cover: "../street food/picture/Hamburger1.jpg" } },
            { title: "Hot Dog", country: "United States", continent: "North America", type: "Snack", price: "$2 - $6", description: "Sausage in a sliced bun.", ingredients: "Sausage • Bun • Mustard", score: 8.2, images: { cover: "../street food/picture/HotDog1.jpg" } },
            { title: "Burrito", country: "Mexico", continent: "North America", type: "Wrap", price: "$5 - $10", description: "Flour tortilla wrapped around fillings.", ingredients: "Tortilla • Beans • Rice • Meat", score: 8.6, images: { cover: "../street food/picture/Burrito1.jpg" } },
            { title: "Nachos", country: "Mexico", continent: "North America", type: "Snack", price: "$4 - $9", description: "Corn chips with cheese and toppings.", ingredients: "Corn chips • Cheese • Jalapeños", score: 8.0, images: { cover: "../street food/picture/Nachos1.jpg" } },
            { title: "Clam Chowder", country: "United States", continent: "North America", type: "Soup", price: "$6 - $12", description: "Creamy soup with clams and potatoes.", ingredients: "Clams • Potato • Cream", score: 8.4, images: { cover: "../street food/picture/ClamChowder1.jpg" } },
            { title: "Gumbo", country: "United States", continent: "North America", type: "Stew", price: "$8 - $14", description: "Louisiana stew with roux.", ingredients: "Roux • Okra • Sausage • Shrimp", score: 8.5, images: { cover: "../street food/picture/Gumbo1.jpg" } },
            { title: "Buffalo Wings", country: "United States", continent: "North America", type: "Snack", price: "$6 - $12", description: "Deep-fried wings in hot sauce.", ingredients: "Chicken wings • Hot sauce • Butter", score: 8.6, images: { cover: "../street food/picture/BuffaloWings1.jpg" } },
            { title: "Bagel with Lox", country: "United States", continent: "North America", type: "Bread", price: "$4 - $10", description: "Bagel with cream cheese and smoked salmon.", ingredients: "Bagel • Cream cheese • Salmon", score: 8.3, images: { cover: "../street food/picture/BagelLox1.jpg" } },
            { title: "Philly Cheesesteak", country: "United States", continent: "North America", type: "Sandwich", price: "$7 - $12", description: "Beef and cheese in a hoagie roll.", ingredients: "Beef • Cheese • Roll", score: 8.5, images: { cover: "../street food/picture/PhillyCheesesteak1.webp" } }
        ];

        const saExtras = [
            { title: "Feijoada", country: "Brazil", continent: "South America", type: "Stew", price: "R$20 - R$40", description: "Black bean stew with pork.", ingredients: "Black beans • Pork • Rice", score: 8.8, images: { cover: "../street food/picture/Feijoada1.jpg" } },
            { title: "Asado", country: "Argentina", continent: "South America", type: "BBQ", price: "$8 - $20", description: "Argentine barbecue of various meats.", ingredients: "Beef • Chimichurri", score: 8.9, images: { cover: "../street food/picture/Asado1.jpg" } },
            { title: "Ceviche", country: "Peru", continent: "South America", type: "Seafood", price: "S/15 - S/40", description: "Citrus-cured fish with chili and onion.", ingredients: "Fish • Lime • Chili • Onion", score: 9.0, images: { cover: "../street food/picture/Ceviche1.jpg" } },
            { title: "Pão de Queijo", country: "Brazil", continent: "South America", type: "Bread", price: "R$3 - R$8", description: "Chewy cheese bread balls.", ingredients: "Tapioca • Cheese • Egg", score: 8.4, images: { cover: "../street food/picture/PaoDeQueijo1.jpg" } },
            { title: "Churrasco", country: "Brazil", continent: "South America", type: "BBQ", price: "$10 - $25", description: "Grilled beef on skewers.", ingredients: "Beef • Salt", score: 8.7, images: { cover: "../street food/picture/Churrasco1.jpg" } },
            { title: "Choripán", country: "Argentina", continent: "South America", type: "Sandwich", price: "$3 - $7", description: "Chorizo sandwich with chimichurri.", ingredients: "Chorizo • Bread • Chimichurri", score: 8.5, images: { cover: "../street food/picture/Choripan1.jpg" } },
            { title: "Moqueca", country: "Brazil", continent: "South America", type: "Stew", price: "$10 - $20", description: "Coconut milk seafood stew.", ingredients: "Fish • Coconut milk • Dendê oil", score: 8.6, images: { cover: "../street food/picture/Moqueca1.jpg" } },
            { title: "Ajiaco", country: "Colombia", continent: "South America", type: "Soup", price: "$5 - $12", description: "Chicken and potato soup with corn.", ingredients: "Chicken • Potato • Corn", score: 8.3, images: { cover: "../street food/picture/Ajiaco1.jpg" } }
        ];

        const africaExtras = [
            { title: "Jollof Rice", country: "West Africa", continent: "Africa", type: "Rice", price: "$4 - $10", description: "Tomato-based spiced rice.", ingredients: "Rice • Tomato • Pepper • Spices", score: 8.7, images: { cover: "../street food/picture/JollofRice1.jpg" } },
            { title: "Bobotie", country: "South Africa", continent: "Africa", type: "Baked", price: "R40 - R$90", description: "Spiced minced meat with egg topping.", ingredients: "Minced meat • Egg • Curry powder", score: 8.3, images: { cover: "../street food/picture/Bobotie1.jpg" } },
            { title: "Tagine", country: "Morocco", continent: "Africa", type: "Stew", price: "MAD40 - MAD90", description: "Slow-cooked stew with spices.", ingredients: "Lamb/Chicken • Preserved lemon • Olives", score: 8.8, images: { cover: "../street food/picture/Tagine1.jpeg" } },
            { title: "Injera with Doro Wat", country: "Ethiopia", continent: "Africa", type: "Stew", price: "Br120 - Br250", description: "Sourdough flatbread with spicy chicken stew.", ingredients: "Teff • Chicken • Berbere", score: 8.9, images: { cover: "../street food/picture/Injera1.jpg" } },
            { title: "Koshari", country: "Egypt", continent: "Africa", type: "Rice/Pasta", price: "E£10 - E£30", description: "Rice, lentils, pasta with tomato sauce.", ingredients: "Rice • Lentils • Pasta • Tomato sauce", score: 8.4, images: { cover: "../street food/picture/Koshari1.jpg" } },
            { title: "Suya", country: "Nigeria", continent: "Africa", type: "Skewers", price: "$2 - $6", description: "Grilled skewers with peanut spice rub.", ingredients: "Beef • Groundnut spice", score: 8.6, images: { cover: "../street food/picture/Suya1.jpg" } },
            { title: "Nyama Choma", country: "Kenya", continent: "Africa", type: "BBQ", price: "$5 - $12", description: "Grilled goat or beef.", ingredients: "Goat/Beef • Salt", score: 8.3, images: { cover: "../street food/picture/NyamaChoma1.png" } },
            { title: "Shakshuka", country: "Tunisia", continent: "Africa", type: "Egg", price: "$3 - $7", description: "Eggs poached in spicy tomato sauce.", ingredients: "Egg • Tomato • Chili • Paprika", score: 8.5, images: { cover: "../street food/picture/Shakshuka1.jpg" } }
        ];

        const oceaniaExtras = [
            { title: "Lamingtons", country: "Australia", continent: "Oceania", type: "Cake", price: "$2 - $5", description: "Sponge cake with chocolate and coconut.", ingredients: "Sponge • Chocolate • Coconut", score: 8.2, images: { cover: "../street food/picture/Lamingtons1.jpg" } },
            { title: "Pavlova", country: "New Zealand", continent: "Oceania", type: "Dessert", price: "$4 - $8", description: "Meringue dessert with cream and fruit.", ingredients: "Egg white • Sugar • Cream • Fruit", score: 8.4, images: { cover: "../street food/picture/Pavlova1.jpg" } },
            { title: "Sausage Sizzle", country: "Australia", continent: "Oceania", type: "Snack", price: "$2 - $6", description: "Grilled sausage on bread with onions.", ingredients: "Sausage • Bread • Onion", score: 8.0, images: { cover: "../street food/picture/SausageSizzle1.jpg" } },
            { title: "Chiko Roll", country: "Australia", continent: "Oceania", type: "Snack", price: "$2 - $4", description: "Deep-fried roll inspired by spring rolls.", ingredients: "Pastry • Cabbage • Beef", score: 7.8, images: { cover: "../street food/picture/ChikoRoll1.jpg" } },
            { title: "Barramundi", country: "Australia", continent: "Oceania", type: "Fish", price: "$10 - $20", description: "Grilled or pan-fried native fish.", ingredients: "Barramundi • Lemon • Herbs", score: 8.5, images: { cover: "../street food/picture/Barramundi1.webp" } },
            { title: "Kangaroo Steak", country: "Australia", continent: "Oceania", type: "Meat", price: "$12 - $25", description: "Lean grilled kangaroo steak.", ingredients: "Kangaroo • Pepper • Salt", score: 8.1, images: { cover: "../street food/picture/KangarooSteak1.jpg" } },
            { title: "Fairy Bread", country: "Australia", continent: "Oceania", type: "Snack", price: "$1 - $3", description: "White bread with butter and sprinkles.", ingredients: "Bread • Butter • Sprinkles", score: 7.5, images: { cover: "../street food/picture/FairyBread1.jpg" } },
            { title: "Dagwood Dog", country: "Australia", continent: "Oceania", type: "Snack", price: "$2 - $4", description: "Deep-fried sausage on a stick.", ingredients: "Sausage • Batter • Tomato sauce", score: 7.8, images: { cover: "../street food/picture/DagwoodDog1.jpg" } },
            { title: "Hamdog", country: "Australia", continent: "Oceania", type: "Snack", price: "$3 - $6", description: "Hot dog wrapped in a hamburger patty.", ingredients: "Hot dog • Hamburger patty • Bun • Toppings", score: 7.9, images: { cover: "../street food/picture/Hamdog1.jpeg" } }
        ];

        function pushUnique(list, items){
            items.forEach(i => { if (!byTitle.has(i.title)) { baseList.push(i); byTitle.add(i.title); } });
        }

        function ensureContinent(name, extras){
            const current = baseList.filter(i => i.continent === name).length;
            if (current < 10){
                pushUnique(baseList, extras.slice(0, 10 - current));
            }
        }

        function ensureMalaysia(){
            const current = baseList.filter(i => i.country === 'Malaysia').length;
            if (current < 10){
                pushUnique(baseList, malaysiaExtras.slice(0, 10 - current));
            }
        }

        ensureMalaysia();
        ensureContinent('Asia', asiaExtras);
        ensureContinent('Europe', europeExtras);
        ensureContinent('North America', naExtras);
        ensureContinent('South America', saExtras);
        ensureContinent('Africa', africaExtras);
        ensureContinent('Oceania', oceaniaExtras);
    })();
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

    // Enrich with basic nutrition if missing
    const defaultsNutrition = { calories: '300 kcal', protein: '10 g', carbs: '40 g', fat: '10 g' };
    const enriched = Array.from(byTitle.values()).map(item => {
        const nutrition = item.nutrition || {};
        const history = item.history || {};
        const culture = item.culture || {};
        const healthBenefits = item.healthBenefits || '';
        return Object.assign({}, item, {
            nutrition: {
                calories: nutrition.calories || defaultsNutrition.calories,
                protein: nutrition.protein || defaultsNutrition.protein,
                carbs: nutrition.carbs || defaultsNutrition.carbs,
                fat: nutrition.fat || defaultsNutrition.fat
            },
            history: {
                background: history.background || (item.description || ''),
                origin: history.origin || (item.country ? `A beloved ${item.country} favourite.` : '')
            },
            culture: {
                significance: culture.significance || 'Popular street food enjoyed by locals and tourists alike.',
                occasions: culture.occasions || 'Commonly eaten as everyday comfort food and during gatherings.',
                bestPlaces: culture.bestPlaces || (item.country ? `Best found in ${item.country} night markets and hawker centres.` : 'Best found at local markets and street vendors.')
            },
            healthBenefits: healthBenefits || 'Provides energy and essential nutrients; enjoy in moderation.'
        });
    });

    window.SiteData.foods = enriched;
})();


