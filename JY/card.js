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

const container = document.getElementById("cardContainer");
const filterCountry = document.getElementById("filterCountry");
const filterMethod = document.getElementById("filterMethod");
const searchInput = document.querySelector(".searchInput");

function populateFilters() {
    const countries = [...new Set(foods.map(f => f.country))].sort();
    const methods = [...new Set(foods.map(f => f.method))].sort();

    filterCountry.innerHTML = `<option value="">All Countries</option>`;
    filterMethod.innerHTML = `<option value="">All Methods</option>`;

    countries.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c;
        opt.textContent = c;
        filterCountry.appendChild(opt);
    });

    methods.forEach(m => {
        const opt = document.createElement("option");
        opt.value = m;
        opt.textContent = m;
        filterMethod.appendChild(opt);
    });
}

function renderCards() {
    container.innerHTML = "";
    foods.forEach(food => {
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
                    <div class="card-tags">
                        ${food.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}
                    </div>
                </div>
            </a>
        `;
        container.appendChild(card);
    });
}

// Search + filter
function filterCards() {
    const searchVal = searchInput.value.toLowerCase();
    const countryVal = filterCountry.value;
    const methodVal = filterMethod.value;

    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        const title = card.querySelector(".card-title").textContent.toLowerCase();
        const country = card.getAttribute("data-country");
        const method = card.getAttribute("data-method");

        const matchSearch = title.includes(searchVal);
        const matchCountry = countryVal === "" || country === countryVal;
        const matchMethod = methodVal === "" || method === methodVal;

        if (matchSearch && matchCountry && matchMethod) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
}

populateFilters();
renderCards();

searchInput.addEventListener("input", filterCards);
filterCountry.addEventListener("change", filterCards);
filterMethod.addEventListener("change", filterCards);
