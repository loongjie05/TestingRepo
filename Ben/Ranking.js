
(function(){
	const select = document.getElementById('continentSelect');
	const grid = document.getElementById('rankingGrid');
	const moreGrid = document.getElementById('moreGrid');
	const continentName = document.getElementById('continentName');
	const moreContinentName = document.getElementById('moreContinentName');

	// Build data from shared dataset
	const foods = (window.SiteData && window.SiteData.foods) ? window.SiteData.foods : [];
	const data = foods.reduce((acc, item)=>{
		const isMalaysia = item.country === 'Malaysia';
		const continentKey = item.continent;

		function pushTo(key){
			if (!key) return;
			acc[key] = acc[key] || [];
			acc[key].push({
				name: item.title,
				score: item.score || 9.0,
				image: item.images?.cover || '',
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


