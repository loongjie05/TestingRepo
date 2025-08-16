const foods = [
    {
        title: "Nasi Lemak",
        img: "street food/picture/NasiLemak1.webp",
        time: "Prep: 15mins • Cook: 50mins • Total: 1h 5mins",
        tags: ["Beef", "Grilled"],
        link: "street food/NasiLemak.html",
        continent: "Malaysia",
        type: "Rice",
        method: "Boiling",
        flavor: "Spicy"
    },
    {
        title: "Xiaolongbao",
        img: "https://www.themealdb.com/images/media/meals/1529444830.jpg",
        time: "Prep: 40min • Cook: 10min",
        tags: ["Pork", "Dumpling"],
        continent: "Asia",
        type: "Rice",
        method: "Boiling",
        flavor: "Savory"
    },
    {
        title: "Pastel de Nata",
        img: "https://www.themealdb.com/images/media/meals/wrpwuu1511786491.jpg",
        time: "Prep: 1h 15min • Cook: 20min",
        tags: ["Dessert", "Egg"],
        continent: "Europe",
        method: "Baking",
        flavor: "Sweet"
    },
    {
        title: "Tteokbokki",
        img: "https://www.themealdb.com/images/media/meals/x0lk931587671540.jpg",
        time: "Prep: 15min • Cook: 20min",
        tags: ["Korean", "Spicy"],
        continent: "Asia",
        method: "Boiling",
        flavor: "Spicy"
    },
    {
        title: "Banh Mi",
        img: "https://www.themealdb.com/images/media/meals/7y3txq1560454283.jpg",
        time: "Prep: 10min • Cook: 5min",
        tags: ["Vietnamese", "Sandwich"],
        continent: "Asia",
        method: "Grilling",
        flavor: "Savory"
    },
    {
        title: "Arepas",
        img: "https://www.themealdb.com/images/media/meals/58oia61564916529.jpg",
        time: "Prep: 20min • Cook: 15min",
        tags: ["Cornmeal", "Snack"],
        continent: "South America",
        method: "Grilling",
        flavor: "Savory"
    },
    {
        title: "Churros",
        img: "https://www.themealdb.com/images/media/meals/txsupu1511815755.jpg",
        time: "Prep: 30min • Cook: 15min",
        tags: ["Dessert", "Fried"],
        continent: "Europe",
        method: "Frying",
        flavor: "Sweet"
    },
    {
        title: "Jerk Chicken",
        img: "https://www.themealdb.com/images/media/meals/uvuyxu1503067369.jpg",
        time: "Prep: 20min • Cook: 40min",
        tags: ["Spicy", "Grilled"],
        continent: "North America",
        method: "Grilling",
        flavor: "Spicy"
    },
    {
        title: "Falafel",
        img: "https://www.themealdb.com/images/media/meals/txruwx1487347049.jpg",
        time: "Prep: 30min • Cook: 10min",
        tags: ["Vegetarian", "Fried"],
        continent: "Asia",
        method: "Frying",
        flavor: "Savory"
    },
    {
        title: "Poutine",
        img: "https://www.themealdb.com/images/media/meals/uuyrrx1487327597.jpg",
        time: "Prep: 15min • Cook: 15min",
        tags: ["Fast Food", "Cheese"],
        continent: "Americas",
        method: "Frying",
        flavor: "Savory"
    }
];

function populateCustomSelect(id, items, allLabel) {
  const container = document.querySelector(`#${id} .select-items`);
  container.innerHTML = "";

  const allDiv = document.createElement("div");
  allDiv.textContent = allLabel;
  allDiv.dataset.value = "";
  container.appendChild(allDiv);

  items.forEach(item => {
    const div = document.createElement("div");
    div.textContent = item;
    div.dataset.value = item;
    container.appendChild(div);
  });
}

const continents = [...new Set(foods.map(f => f.continent))].sort();
const methods = [...new Set(foods.map(f => f.method))].sort();
const flavors = [...new Set(foods.map(f => f.flavor))].sort();
const types = [...new Set(foods.map(f => f.type))].sort();

populateCustomSelect("filterContinents", continents, "Continents / Country");
populateCustomSelect("filterMethod", methods, "Cooking Methods");
populateCustomSelect("filterFlavor", flavors, "Flavors");
populateCustomSelect("filterType", types, "Types");

function bindSelectEvents() {
  document.querySelectorAll(".custom-select").forEach(select => {
    const selected = select.querySelector(".select-selected");
    const items = select.querySelector(".select-items");

    select.addEventListener("mouseenter", () => select.classList.add("open"));
    select.addEventListener("mouseleave", () => select.classList.remove("open"));

    items.querySelectorAll("div").forEach(option => {
      option.addEventListener("click", () => {
        selected.textContent = option.textContent;
        select.classList.remove("open");
        filterCards();
      });
    });
  });
}
bindSelectEvents();

const container = document.getElementById("cardContainer");
const searchInput = document.querySelector(".searchInput");

function renderCards(list) {
  const container = document.getElementById("cardContainer");
  container.innerHTML = "";

  list.forEach(food => {
    const card = document.createElement("article");
    card.className = "article-wrapper";

    card.innerHTML = `
      <div class="container-project" style="background-image: url('${food.img}');"></div>
      <div class="project-info">
        <div class="flex-pr">
          <div class="project-title text-nowrap">${food.title}</div>
          <div class="project-hover">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke-linejoin="round" stroke-linecap="round" viewBox="0 0 24 24" stroke-width="2" fill="none" stroke="currentColor">
              <line y2="12" x2="19" y1="12" x1="5"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
        </div>
        <div class="types">
          ${food.tags.map(t => `<span class="project-type">• ${t}</span>`).join('')}
        </div>
      </div>
    `;
    
    card.addEventListener("click", () => {
      window.location.href = food.link;
    });

    container.appendChild(card);
  });
}

function filterCards() {
  const searchVal = searchInput.value.toLowerCase();
  const continentVal = document.querySelector("#filterContinents .select-selected").textContent;
  const methodVal = document.querySelector("#filterMethod .select-selected").textContent;
  const flavorVal = document.querySelector("#filterFlavor .select-selected").textContent;
  const typeVal = document.querySelector("#filterType .select-selected").textContent;

  const filtered = foods.filter(food => {
    const matchSearch = food.title.toLowerCase().includes(searchVal);
    const matchContinent = continentVal === "Continents / Country" || food.continent === continentVal;
    const matchMethod = methodVal === "Cooking Methods" || food.method === methodVal;
    const matchFlavor = flavorVal === "Flavors" || food.flavor === flavorVal;
    const matchType = typeVal === "Types" || food.type === typeVal;

    return matchSearch && matchContinent && matchMethod && matchFlavor && matchType;
  });

  renderCards(filtered);
}

function clearSearch() {
  searchInput.value = "";
  filterCards();
}

searchInput.addEventListener("input", filterCards);

renderCards(foods);
