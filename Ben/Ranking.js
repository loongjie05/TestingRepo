(function(){
	const select = document.getElementById('countrySelect');
	const grid = document.getElementById('rankingGrid');
	const countryName = document.getElementById('countryName');

	const data = {
		Malaysia: [
			{ name: 'Nasi Lemak', score: 9.6, image: '../street food/picture/NasiLemak1.webp', desc: 'Fragrant coconut rice with sambal, crispy anchovies, peanuts and egg.' },
			{ name: 'Char Kway Teow', score: 9.2, image: 'https://images.unsplash.com/photo-1604908553729-8ad533e7f2b5?q=80&w=1200&auto=format&fit=crop', desc: 'Wok-hei rich stir-fried flat noodles with prawns and Chinese sausage.' },
			{ name: 'Bak Kut Teh', score: 8.9, image: '../LJ/pictures/BakKutTeh.png', desc: 'Herbal pork rib soup served with rice and youtiao.' },
		],
		Japan: [
			{ name: 'Sushi', score: 9.7, image: '../LJ/pictures/Sushi.png', desc: 'Hand-formed vinegared rice topped with the freshest seafood.' },
			{ name: 'Ramen', score: 9.3, image: '../LJ/pictures/Ramen.png', desc: 'Noodles in rich broth, perfected with chashu and ajitama.' },
			{ name: 'Tempura', score: 8.8, image: 'https://images.unsplash.com/photo-1601050690292-3fad1ea8e6cd?q=80&w=1200&auto=format&fit=crop', desc: 'Delicately battered and fried seafood and vegetables.' },
		],
		Thailand: [
			{ name: 'Pad Thai', score: 9.5, image: 'https://images.unsplash.com/photo-1592861956120-e524fc739696?q=80&w=1200&auto=format&fit=crop', desc: 'Sweet, sour, and savory stir-fried rice noodles with peanuts.' },
			{ name: 'Tom Yum', score: 9.1, image: 'https://images.unsplash.com/photo-1604908553780-3d03b75bd905?q=80&w=1200&auto=format&fit=crop', desc: 'Aromatic hot-and-sour soup with lemongrass and lime.' },
			{ name: 'Green Curry', score: 8.9, image: 'https://images.unsplash.com/photo-1599128198964-e37021545f3b?q=80&w=1200&auto=format&fit=crop', desc: 'Creamy coconut curry with a gentle heat and basil.' },
		],
		USA: [
			{ name: 'Burger', score: 9.4, image: '../LJ/pictures/Burger.png', desc: 'Juicy patty, melty cheese, toasted bun—iconic comfort food.' },
			{ name: 'Fries', score: 9.0, image: '../LJ/pictures/Fries.png', desc: 'Crisp golden fries, perfect with any dip.' },
			{ name: 'Pancakes', score: 8.7, image: '../LJ/pictures/Pancake.png', desc: 'Fluffy stacks with butter and maple syrup.' },
		],
		Italy: [
			{ name: 'Pasta', score: 9.5, image: '../LJ/pictures/pasta.png', desc: 'Al dente perfection tossed in rich sauces.' },
			{ name: 'Pizza Margherita', score: 9.2, image: 'https://images.unsplash.com/photo-1548365328-8b6db78a6d7b?q=80&w=1200&auto=format&fit=crop', desc: 'Tomato, mozzarella, basil—simple and sublime.' },
			{ name: 'Tiramisu', score: 8.9, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476a?q=80&w=1200&auto=format&fit=crop', desc: 'Coffee-soaked layers with mascarpone and cocoa.' },
		],
		Mexico: [
			{ name: 'Taco', score: 9.4, image: '../LJ/pictures/Taco.png', desc: 'Handheld joy with vibrant fillings and salsas.' },
			{ name: 'Elote', score: 9.0, image: 'https://images.unsplash.com/photo-1625944520224-1f7ae0220a88?q=80&w=1200&auto=format&fit=crop', desc: 'Charred street corn with lime, chili and cotija.' },
			{ name: 'Churros', score: 8.8, image: 'https://images.unsplash.com/photo-1612280281226-87bff8f8654f?q=80&w=1200&auto=format&fit=crop', desc: 'Crispy sticks dusted in cinnamon sugar.' },
		],
		China: [
			{ name: 'Xiao Long Bao', score: 9.6, image: 'https://images.unsplash.com/photo-1607185074306-76e390af8a68?q=80&w=1200&auto=format&fit=crop', desc: 'Soup dumplings with delicate wrappers and rich broth.' },
			{ name: 'Peking Duck', score: 9.2, image: 'https://images.unsplash.com/photo-1625944520102-14aa8fa2a52c?q=80&w=1200&auto=format&fit=crop', desc: 'Crispy-skinned duck served with pancakes and hoisin.' },
			{ name: 'Mapo Tofu', score: 8.9, image: 'https://images.unsplash.com/photo-1625944520147-14bd71e82ce2?q=80&w=1200&auto=format&fit=crop', desc: 'Silky tofu in a spicy, numbing sauce.' },
		],
		India: [
			{ name: 'Butter Chicken', score: 9.5, image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1200&auto=format&fit=crop', desc: 'Creamy tomato-based curry with tender chicken.' },
			{ name: 'Biryani', score: 9.1, image: 'https://images.unsplash.com/photo-1625944520115-5f3e6e8a4a32?q=80&w=1200&auto=format&fit=crop', desc: 'Fragrant spiced rice layered with meat or vegetables.' },
			{ name: 'Masala Dosa', score: 8.8, image: 'https://images.unsplash.com/photo-1596797038530-2c1072293a4e?q=80&w=1200&auto=format&fit=crop', desc: 'Crispy crepe with spiced potato filling.' },
		],
		Korea: [
			{ name: 'Bibimbap', score: 9.3, image: 'https://images.unsplash.com/photo-1576096858982-2f7fe6a0b663?q=80&w=1200&auto=format&fit=crop', desc: 'Mixed rice bowl with veggies, gochujang and egg.' },
			{ name: 'Korean Fried Chicken', score: 9.2, image: 'https://images.unsplash.com/photo-1668236543098-9c1f0ee691eb?q=80&w=1200&auto=format&fit=crop', desc: 'Ultra-crispy double-fried chicken with glaze.' },
			{ name: 'Kimchi Jjigae', score: 8.8, image: 'https://images.unsplash.com/photo-1604908831491-31f2d7737f06?q=80&w=1200&auto=format&fit=crop', desc: 'Comforting stew with kimchi and tofu.' },
		],
		Indonesia: [
			{ name: 'Nasi Goreng', score: 9.2, image: 'https://images.unsplash.com/photo-1625944520281-b1c1dfbcdc2f?q=80&w=1200&auto=format&fit=crop', desc: 'Smoky fried rice crowned with a fried egg.' },
			{ name: 'Satay', score: 9.0, image: '../LJ/pictures/Satay.png', desc: 'Skewers with rich peanut sauce.' },
			{ name: 'Rendang', score: 8.9, image: 'https://images.unsplash.com/photo-1625944520269-0e8df8f92445?q=80&w=1200&auto=format&fit=crop', desc: 'Slow-cooked spiced beef in coconut milk.' },
		],
		Singapore: [
			{ name: 'Hainanese Chicken Rice', score: 9.4, image: '../LJ/pictures/ChickenRice.png', desc: 'Poached chicken with fragrant rice and chili.' },
			{ name: 'Laksa', score: 9.0, image: 'https://images.unsplash.com/photo-1625944520122-55dc7a72b1b2?q=80&w=1200&auto=format&fit=crop', desc: 'Spicy coconut noodle soup with seafood.' },
			{ name: 'Char Kway Teow', score: 8.8, image: 'https://images.unsplash.com/photo-1604908553729-8ad533e7f2b5?q=80&w=1200&auto=format&fit=crop', desc: 'Wok-fried flat noodles with prawns.' },
		],
		Vietnam: [
			{ name: 'Pho', score: 9.5, image: 'https://images.unsplash.com/photo-1604908177129-b6b5480bec93?q=80&w=1200&auto=format&fit=crop', desc: 'Aromatic noodle soup with herbs and beef.' },
			{ name: 'Banh Mi', score: 9.1, image: 'https://images.unsplash.com/photo-1541450805268-4822a3a774ca?q=80&w=1200&auto=format&fit=crop', desc: 'Crisp baguette with savory fillings and pickles.' },
			{ name: 'Bun Cha', score: 8.8, image: 'https://images.unsplash.com/photo-1595476108010-e97d16229b80?q=80&w=1200&auto=format&fit=crop', desc: 'Grilled pork with vermicelli and herbs.' },
		],
	};

	function render(country){
		const items = (data[country] || []).slice(0,3);
		countryName.textContent = country;
		grid.innerHTML = items.map((item, idx) => {
			const rank = idx + 1;
			const badgeClass = rank === 1 ? '' : rank === 2 ? ' silver' : ' bronze';
			return `
				<div class="rank-card" role="article">
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
	}

	select.addEventListener('change', (e) => render(e.target.value));

	// initial
	render(select.value || 'Malaysia');
})();


