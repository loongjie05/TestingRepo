
const foods = [
    {
        title: "Nasi Lemak",
        img: "street food/picture/NasiLemak1.webp",
        time: "Prep: 15mins • Cook: 50mins • Total: 1h 5mins ",
        tags: ["Beef", "Grilled"],
        link: "street food/NasiLemak.html"
    },
    {
        title: "Xiaolongbao",
        img: "https://www.themealdb.com/images/media/meals/1529444830.jpg",
        time: "Prep: 40min • Cook: 10min",
        tags: ["Pork", "Dumpling"]
    },
    {
        title: "Pastel de Nata",
        img: "https://www.themealdb.com/images/media/meals/wrpwuu1511786491.jpg",
        time: "Prep: 1h 15min • Cook: 20min",
        tags: ["Dessert", "Egg"]
    },
    {
        title: "Tteokbokki",
        img: "https://www.themealdb.com/images/media/meals/x0lk931587671540.jpg",
        time: "Prep: 15min • Cook: 20min",
        tags: ["Korean", "Spicy"]
    },
    {
        title: "Xiaolongbao",
        img: "https://www.themealdb.com/images/media/meals/1529444830.jpg",
        time: "Prep: 40min • Cook: 10min",
        tags: ["Pork", "Dumpling"]
    }, 
    {
        title: "Xiaolongbao",
        img: "https://www.themealdb.com/images/media/meals/1529444830.jpg",
        time: "Prep: 40min • Cook: 10min",
        tags: ["Pork", "Dumpling"]
    }, 
    {
        title: "Xiaolongbao",
        img: "https://www.themealdb.com/images/media/meals/1529444830.jpg",
        time: "Prep: 40min • Cook: 10min",
        tags: ["Pork", "Dumpling"]
    }, 
    {
        title: "Xiaolongbao",
        img: "https://www.themealdb.com/images/media/meals/1529444830.jpg",
        time: "Prep: 40min • Cook: 10min",
        tags: ["Pork", "Dumpling"]
    }, 
];

const container = document.getElementById("cardContainer");

foods.forEach(food => {
    const card = document.createElement("div");
    card.className = "card";
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

function search() {
    let input = document.querySelector(".searchInput").value.toLowerCase();
    let cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        let title = card.querySelector(".card-title").textContent.toLowerCase();
        if (title.includes(input)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
}