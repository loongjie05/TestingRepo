
(function(){
	const select = document.getElementById('continentSelect');
	const grid = document.getElementById('rankingGrid');
	const moreGrid = document.getElementById('moreGrid');
	const continentName = document.getElementById('continentName');
	const moreContinentName = document.getElementById('moreContinentName');

	// Food image mapping using ONLY street food pictures
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

	// Build data from shared dataset
	const foods = (window.SiteData && window.SiteData.foods) ? window.SiteData.foods : [];
	const data = foods.reduce((acc, item)=>{
		const isMalaysia = item.country === 'Malaysia';
		const continentKey = item.continent;

		function pushTo(key){
			if (!key) return;
			acc[key] = acc[key] || [];
			// Use mapped image from street food directory
			const mappedImage = foodImageMap[item.title] || item.images?.cover || '../street food/picture/food_patter_icon.png';
			acc[key].push({
				name: item.title,
				score: item.score || 9.0,
				image: mappedImage,
				desc: item.description || ''
			});
		}

		if (isMalaysia){
			// Include Malaysian foods under both Malaysia and Asia
			pushTo('Malaysia');
			pushTo(continentKey);
		} else {
			pushTo(continentKey);
		}

		return acc;
	}, {});

	// Sort each continent/country list by score (descending)
	Object.keys(data).forEach(key => {
		data[key].sort((a, b) => (b.score || 0) - (a.score || 0));
	});

	// Function to get URL parameters
	function getUrlParameter(name) {
		name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
		var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
		var results = regex.exec(location.search);
		return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
	}

	function render(continent){
		const allItems = (data[continent] || []);
		const topThree = allItems.slice(0,3);
		const others = allItems.slice(3);
		continentName.textContent = continent;
		if(moreContinentName) moreContinentName.textContent = continent;
		grid.innerHTML = topThree.map((item, idx) => {
			const rank = idx + 1;
			const badgeClass = rank === 1 ? '' : rank === 2 ? ' silver' : ' bronze';
			return `
				<div class="rank-card" role="article" data-food-name="${item.name}">
					<div class="rank-badge${badgeClass}">#${rank}</div>
					<div class="media" style="background-image:url('${item.image}')"></div>
					<div class="card-body">
						<div class="food-name">${item.name}</div>
						<div class="meta"><i class="fa-solid fa-star" style="color:#f59e0b"></i><span class="score">${item.score.toFixed(1)}</span><span>rating</span></div>
						<p class="desc">${item.desc}</p>
					</div>
				</div>
			`;
		}).join('');

		// Render others list
		if (moreGrid) {
			moreGrid.innerHTML = others.map((item, idx) => {
				const rank = 3 + idx + 1;
				return `
					<div class="more-card" role="article" data-food-name="${item.name}">
						<div class="media" style="background-image:url('${item.image}')"></div>
						<div class="card-body">
							<div class="food-name">#${rank} ${item.name}</div>
							<div class="meta"><i class=\"fa-solid fa-star\" style=\"color:#f59e0b\"></i><span class="score">${item.score.toFixed(1)}</span><span>rating</span></div>
						</div>
					</div>
				`;
			}).join('');
		}

		// Make cards clickable to open Food Info with selected food
		Array.from(grid.querySelectorAll('.rank-card')).forEach(card => {
			card.style.cursor = 'pointer';
			card.addEventListener('click', () => {
				const name = card.getAttribute('data-food-name');
				const url = `../Ben/FoodInfo.html?food=${encodeURIComponent(name)}`;
				window.location.href = url;
			});
		});

		if (moreGrid) {
			Array.from(moreGrid.querySelectorAll('.more-card')).forEach(card => {
				card.style.cursor = 'pointer';
				card.addEventListener('click', () => {
					const name = card.getAttribute('data-food-name');
					const url = `../Ben/FoodInfo.html?food=${encodeURIComponent(name)}`;
					window.location.href = url;
				});
			});
		}
	}

	// Handle continent selection change
	select.addEventListener('change', (e) => {
		render(e.target.value);
		const url = new URL(window.location.href);
		url.searchParams.set('continent', e.target.value);
		history.replaceState(null, '', url.toString());
	});

	// Initialize with continent from URL parameter or default to Malaysia
	const continentFromUrl = getUrlParameter('continent');
	const initialContinent = continentFromUrl || 'Malaysia';
	
	// Set the select value to match the initial continent
	select.value = initialContinent;
	
	// Render the initial continent
	render(initialContinent);
})();


