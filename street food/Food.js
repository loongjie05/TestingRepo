const pages = [
  {
    food: {
      title: "Nasi Lemak",
      text: "A dish originating in Malay cuisine that consists of rice cooked in coconut milk and pandan leaf.",
      img: "picture/NasiLemak2.jpg"
    },
    about: {
      title: "Welcome To Our",
      highlight: "Foodies",
      p1: "Aptent taciti sociosqu ad litora conubia nostra, per inceptos himenaeos.",
      p2: "Nunc vel pellentesque. Class aptent taciti sociosqu ad litora torquent per conubia nostra.",
      img2: "picture/NasiLemak3.jpg"
    }
  },
  {
    food: {
      title: "Taste the Best",
      text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.",
      img: "https://i.ibb.co/6mJrC2t/food.jpg"
    },
    about: {
      title: "Discover Delicious",
      highlight: "Meals",
      p1: "Curabitur blandit tempus porttitor. Integer posuere erat a ante venenatis dapibus.",
      p2: "Donec ullamcorper nulla non metus auctor fringilla.",
    }
  }
];

function renderPage() {
  const urlParams = new URLSearchParams(window.location.search);
  let pageIndex = parseInt(urlParams.get("page") || "1") - 1;

  if (pageIndex < 0 || pageIndex >= pages.length) {
    document.getElementById("app").innerHTML = "<h2>Page not found</h2>";
    return;
  }

  const page = pages[pageIndex];
  const template = document.getElementById("page-template");
  const clone = template.content.cloneNode(true);

  // Food
  clone.querySelector(".food-title").textContent = page.food.title;
  clone.querySelector(".food-text").textContent = page.food.text;
  clone.querySelector(".food-img-src").src = page.food.img;

  // About
  clone.querySelector(".food-img2-src").src = page.about.img2;
  clone.querySelector(".about-title").textContent = page.about.title;
  clone.querySelector(".about-highlight").textContent = page.about.highlight;
  clone.querySelector(".about-p1").textContent = page.about.p1;
  clone.querySelector(".about-p2").textContent = page.about.p2;

  // Button
  const nav = document.createElement("div");
  nav.className = "nav-buttons";
  nav.innerHTML = `
    <button onclick="setPageIndex(${(pageIndex - 1 + pages.length) % pages.length})">⬅ Prev</button>
    <button onclick="setPageIndex(${(pageIndex + 1) % pages.length})">Next ➡</button>
  `;
  clone.appendChild(nav);

  document.getElementById("app").innerHTML = "";
  document.getElementById("app").appendChild(clone);
}

function setPageIndex(index) {
  window.history.pushState({}, "", `?page=${index + 1}`);
  renderPage(); 
}

window.addEventListener("popstate", renderPage);

document.addEventListener("DOMContentLoaded", renderPage);
