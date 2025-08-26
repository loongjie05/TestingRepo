const foods = [
    {
      title: "Nasi Lemak",
      img: "../street food/picture/NasiLemak1.webp",
      tags: ["Time: 1h 5 mins", "Spicy", "Malaysia"],
      link: "../street food/Food.html?page=1",
      continent: "Asia",
      type: "Rice",
      method: "Boiling",
      flavor: "Spicy"
    },
    {
      title: "Mango Sticky Rice",
      img: "../street food/picture/MangoRice1.jpg",
      tags: ["Time: 1h ", "Sweet", "Thailand"],
      link: "../street food/Food.html?page=2",
      continent: "Asia",
      type: "Rice",
      method: "Boiling",
      flavor: "Sweet"
    },
    {
      title: "Taco",
      img: "../street food/picture/Taco1.jpg",
      tags: ["Time: 35min", "Savory", "Mexico"],
      link: "../street food/Food.html?page=3",
      continent: "North America",
      type: "Bread",
      method: "Grilled",
      flavor: "Savory"
    },
    {
      title: "Churros",
      img: "../street food/picture/Churros1.webp",
      tags: ["Time: 25min", "Sweet", "Spain"],
      link: "../street food/Food.html?page=4",
      continent: "Europe",
      type: "Pastry",
      method: "Fried",
      flavor: "Sweet"
    },
    {
      title: "Bunny Chow",
      img: "../street food/picture/BunnyChow1.webp",
      tags: ["Time: 1h 10min", "Savory", "South Africa"],
      link: "../street food/Food.html?page=5",
      continent: "Africa",
      type: "Bread",
      method: "Baked",
      flavor: "Savory"
    },
    {
      title: "Meat Pie",
      img: "../street food/picture/MeatPie1.jpg",
      tags: ["Time: 1h", "Savory", "Australia"],
      link: "../street food/Food.html?page=6",
      continent: "Oceania",
      type: "Pastry",
      method: "Baked",
      flavor: "Savory"
    },
    {
      title: "Arepas",
      img: "../street food/picture/Arepas1.jpg",
      tags: ["Time: 40min", "Savory", "Venezuela"],
      link: "../street food/Food.html?page=7",
      continent: "South America",
      type: "Bread",
      method: "Grilled",
      flavor: "Savory"
    },
    {
      title: "Pad Thai",
      img: "../street food/picture/PadThai1.webp",
      tags: ["Time: 40min", "Savory", "Thailand"],
      link: "../street food/Food.html?page=8",
      continent: "Asia",
      type: "Noodles",
      method: "Fried",
      flavor: "Savory"
    },
    {
      title: "Falafel",
      img: "../street food/picture/Falafel1.jpg",
      tags: ["Time: 45min", "Savory", "Middle East"],
      link: "../street food/Food.html?page=9",
      continent: "Asia",
      type: "Snack",
      method: "Fried",
      flavor: "Savory"
    },
    {
      title: "Satay",
      img: "../street food/picture/Satay1.avif",
      tags: ["Time: 50min", "Savory", "Malaysia"],
      link: "../street food/Food.html?page=10",
      continent: "Asia",
      type: "Skewers",
      method: "Grilled",
      flavor: "Savory"
    },
    {
      title: "Poutine",
      img: "../street food/picture/Poutine1.jpg",
      tags: ["Time: 30min", "Savory", "Canada"],
      link: "../street food/Food.html?page=11",
      continent: "North America",
      type: "Snack",
      method: "Fried",
      flavor: "Savory"
    },
    {
      title: "Jerk Chicken",
      img: "../street food/picture/JerkChicken1.jpg",
      tags: ["Time: 1h 30min", "Spicy", "Jamaica"],
      link: "../street food/Food.html?page=12",
      continent: "North America",
      type: "Meat",
      method: "Grilled",
      flavor: "Spicy"
    },
    {
      title: "Takoyaki",
      img: "../street food/picture/Takoyaki1.avif",
      tags: ["Time: 40min", "Savory", "Japan"],
      link: "../street food/Food.html?page=13",
      continent: "Asia",
      type: "Snack",
      method: "Fried",
      flavor: "Savory"
    },
    {
      title: "Empanadas",
      img: "../street food/picture/Empanadas1.webp",
      tags: ["Time: 1h", "Savory", "Argentina"],
      link: "../street food/Food.html?page=14",
      continent: "South America",
      type: "Pastry",
      method: "Baked",
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

populateCustomSelect("filterContinents", continents, "Continents");
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
    const matchContinent = continentVal === "Continents" || food.continent === continentVal;
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
