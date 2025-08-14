const foods = [
    {
        title: "Nasi Lemak",
        img: "street food/picture/NasiLemak1.webp",
        time: "Prep: 15mins • Cook: 50mins • Total: 1h 5mins",
        tags: ["Beef", "Grilled"],
        link: "street food/NasiLemak.html",
        country: "Malaysia",
        type: "Rice",
        method: "Boiling",
        flavor: "Spicy"
    },
    {
        title: "Xiaolongbao",
        img: "https://www.themealdb.com/images/media/meals/1529444830.jpg",
        time: "Prep: 40min • Cook: 10min",
        tags: ["Pork", "Dumpling"],
        country: "China",
        type: "Rice",
        method: "Boiling",
        flavor: "Savory"
    },
    {
        title: "Pastel de Nata",
        img: "https://www.themealdb.com/images/media/meals/wrpwuu1511786491.jpg",
        time: "Prep: 1h 15min • Cook: 20min",
        tags: ["Dessert", "Egg"],
        country: "Portugal",
        method: "Baking",
        flavor: "Sweet"
    },
    {
        title: "Tteokbokki",
        img: "https://www.themealdb.com/images/media/meals/x0lk931587671540.jpg",
        time: "Prep: 15min • Cook: 20min",
        tags: ["Korean", "Spicy"],
        country: "Korea",
        method: "Boiling",
        flavor: "Spicy"
    },
    {
        title: "Banh Mi",
        img: "https://www.themealdb.com/images/media/meals/7y3txq1560454283.jpg",
        time: "Prep: 10min • Cook: 5min",
        tags: ["Vietnamese", "Sandwich"],
        country: "Vietnam",
        method: "Grilling",
        flavor: "Savory"
    },
    {
        title: "Arepas",
        img: "https://www.themealdb.com/images/media/meals/58oia61564916529.jpg",
        time: "Prep: 20min • Cook: 15min",
        tags: ["Cornmeal", "Snack"],
        country: "Venezuela",
        method: "Grilling",
        flavor: "Savory"
    },
    {
        title: "Churros",
        img: "https://www.themealdb.com/images/media/meals/txsupu1511815755.jpg",
        time: "Prep: 30min • Cook: 15min",
        tags: ["Dessert", "Fried"],
        country: "Spain",
        method: "Frying",
        flavor: "Sweet"
    },
    {
        title: "Jerk Chicken",
        img: "https://www.themealdb.com/images/media/meals/uvuyxu1503067369.jpg",
        time: "Prep: 20min • Cook: 40min",
        tags: ["Spicy", "Grilled"],
        country: "Jamaica",
        method: "Grilling",
        flavor: "Spicy"
    },
    {
        title: "Falafel",
        img: "https://www.themealdb.com/images/media/meals/txruwx1487347049.jpg",
        time: "Prep: 30min • Cook: 10min",
        tags: ["Vegetarian", "Fried"],
        country: "Middle East",
        method: "Frying",
        flavor: "Savory"
    },
    {
        title: "Poutine",
        img: "https://www.themealdb.com/images/media/meals/uuyrrx1487327597.jpg",
        time: "Prep: 15min • Cook: 15min",
        tags: ["Fast Food", "Cheese"],
        country: "Canada",
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

const countries = [...new Set(foods.map(f => f.country))].sort();
const methods = [...new Set(foods.map(f => f.method))].sort();
const flavors = [...new Set(foods.map(f => f.flavor))].sort();
const types = [...new Set(foods.map(f => f.type))].sort();

populateCustomSelect("filterCountry", countries, "All Countries");
populateCustomSelect("filterMethod", methods, "All Methods");
populateCustomSelect("filterFlavor", flavors, "All Flavors");
populateCustomSelect("filterType", types, "All Types");

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
  container.innerHTML = "";
  list.forEach(food => {
    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("data-country", food.country);
    card.setAttribute("data-method", food.method);
    card.innerHTML = `
      <a href="${food.link}" class="card-link">
        <img src="${food.img}" alt="${food.title}">
        <div class="card-content">
          <div class="card-title">${food.title}</div>
          <div class="card-time">${food.time}</div>
          <div class="card-tags">${food.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
        </div>
      </a>
    `;
    container.appendChild(card);
  });
}

function filterCards() {
  const searchVal = searchInput.value.toLowerCase();
  const countryVal = document.querySelector("#filterCountry .select-selected").textContent;
  const methodVal = document.querySelector("#filterMethod .select-selected").textContent;
  const flavorVal = document.querySelector("#filterFlavor .select-selected").textContent;
  const typeVal = document.querySelector("#filterType .select-selected").textContent;

  const filtered = foods.filter(food => {
    const matchSearch = food.title.toLowerCase().includes(searchVal);
    const matchCountry = countryVal === "All Countries" || food.country === countryVal;
    const matchMethod = methodVal === "All Methods" || food.method === methodVal;
    const matchFlavor = flavorVal === "All Flavors" || food.flavor === flavorVal;
    const matchType = typeVal === "All Types" || food.type === typeVal;

    return matchSearch && matchCountry && matchMethod && matchFlavor && matchType;
  });

  renderCards(filtered);
}

searchInput.addEventListener("input", filterCards);

renderCards(foods);
