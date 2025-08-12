const foods = [
    {
        title: "Nasi Lemak",
        img: "street food/picture/NasiLemak1.webp",
        time: "Prep: 15mins • Cook: 50mins • Total: 1h 5mins ",
        tags: ["Beef", "Grilled"],
        link: "street food/NasiLemak.html",
        country: "Malaysia",
        type: "rice",
        method: "Boiling"
    },
    {
        title: "Xiaolongbao",
        img: "https://www.themealdb.com/images/media/meals/1529444830.jpg",
        time: "Prep: 40min • Cook: 10min",
        tags: ["Pork", "Dumpling"],
        country: "China",
        type: "rice",
        method: "Boiling"
    },
    {
        title: "Pastel de Nata",
        img: "https://www.themealdb.com/images/media/meals/wrpwuu1511786491.jpg",
        time: "Prep: 1h 15min • Cook: 20min",
        tags: ["Dessert", "Egg"],
        country: "Portugal",
        method: "Baking"
    },
    {
        title: "Tteokbokki",
        img: "https://www.themealdb.com/images/media/meals/x0lk931587671540.jpg",
        time: "Prep: 15min • Cook: 20min",
        tags: ["Korean", "Spicy"],
        country: "Korea",
        method: "Boiling"
    },
    {
        title: "Tteokbokki",
        img: "https://www.themealdb.com/images/media/meals/x0lk931587671540.jpg",
        time: "Prep: 15min • Cook: 20min",
        tags: ["Korean", "Spicy"],
        country: "Korea",
        method: "Boiling"
    },
    {
        title: "Tteokbokki",
        img: "https://www.themealdb.com/images/media/meals/x0lk931587671540.jpg",
        time: "Prep: 15min • Cook: 20min",
        tags: ["Korean", "Spicy"],
        country: "Korea",
        method: "Boiling"
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

populateCustomSelect("filterCountry", countries, "All Countries");
populateCustomSelect("filterMethod", methods, "All Methods");

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
      <a href="${food.link}" class="card-link" target="_blank">
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

  const filtered = foods.filter(food => {
    const matchSearch = food.title.toLowerCase().includes(searchVal);
    const matchCountry = countryVal === "All Countries" || food.country === countryVal;
    const matchMethod = methodVal === "All Methods" || food.method === methodVal;
    return matchSearch && matchCountry && matchMethod;
  });

  renderCards(filtered);
}

searchInput.addEventListener("input", filterCards);

renderCards(foods);