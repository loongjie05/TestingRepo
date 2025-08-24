const pages = [
  {
    food: {
      title: "Nasi Lemak",
      text: "A dish originating in Malay cuisine that consists of rice cooked in coconut milk and pandan leaf.",
      img: "picture/NasiLemak2.jpg"
    },
    ingredients: {
      p1: "2 1/2 cups jasmine rice (1 pound 2 ounces, 500 g). 7 ounces (200 ml) coconut milk, preferably from a carton variety (see notes). 2 pandan leaves, cut crosswise into 2-inch pieces. One 1-inch knob (25 g) fresh peeled ginger, julienned. 1 1/2 teaspoons Diamond Crystal kosher salt, plus more to taste; for table salt use half as much by volume or the same weight. To options: Sambal tumis, Fried ikan bilis, Sliced hard-boiled eggs, Fried peanuts, Sliced cucumbers, Fresh or frozen banana leaf"
    },
    recipe: {
      p1: "Step 1: Set up a tiered steamer (see notes), filling the bottom section with about 3 inches of water. Bring to a boil over high heat. Line the steamer tier with cheesecloth. Step 2: Meanwhile, place the rice in a strainer and rinse the grains under running water until the water is almost clear. Drain rice, then transfer to a 10-inch nonstick skillet and add the coconut milk, 7 ounces (200ml) water, pandan leaves, ginger, and salt.Cook on medium heat, stirring continuously, until it thickens like rice pudding, 8-10 minutes. Step 3: Transfer the rice mixture to the cheesecloth-lined steamer tier and spread it in a roughly even layer. Set steamer tier over bottom section of boiling water, cover, and steam over medium heat until the grains are fully cooked, about 45 minutes; start checking rice doneness after 35 minutes of steaming. Once the rice reaches your preferred texture, turn off the heat and leave it to continue steaming, covered, until the steaming stops. The rice should be just cooked, with separate grains and a rich flavor of coconut. Step 4: Serve with sambal tumis and other nasi lemak accompaniments, depending on your preference (note that it's typical to leave the pandan leaves in the nasi lemak, as it's understood they will be removed at the table by the diner; do not eat them). If desired, nasi lemak can be served on a banana leaf, which will contribute its own fragrance to the dish as the rice and toppings are eaten. ",
    }
  },
  {
    food: {
      title: "Char Kway Teow",
      text: "A popular stir-fried flat rice noodle dish in Malaysia, cooked with prawns, Chinese sausage, bean sprouts, and soy sauce over high heat.",
      img: "picture/CharKwayTeow.jpg"
    },
    ingredients: {
      p1: "Flat rice noodles, prawns, Chinese sausage, bean sprouts, egg, garlic, soy sauce, chili paste, oil."
    },
    recipe: {
      p1: "Step 1: Heat wok until very hot, add oil and garlic. Step 2: Stir-fry prawns and Chinese sausage. Step 3: Add noodles, soy sauce, and chili paste. Step 4: Push noodles aside, scramble egg, then mix everything together. Step 5: Add bean sprouts last and toss quickly."
    }
  },
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

  // Ingredients
  const ingredientsP1Container = clone.querySelector(".ingredients-p1");
    ingredientsP1Container.innerHTML = ""; 
    const sentences = page.ingredients.p1.split(/(?<=\.)\s+/);
    sentences.forEach(sentence => {
        const p = document.createElement("p");
        p.textContent = "• " + sentence.trim();
        ingredientsP1Container.appendChild(p);
    });

  //Recipe
  clone.querySelector(".recipe-title").textContent = "How to Make " + page.food.title;
  const RecipeP1Container = clone.querySelector(".recipe-p1");
  RecipeP1Container.innerHTML = ""; 
  const sentences1 = page.recipe.p1.split(/(?=Step\s*\d*:)/);
  sentences1.forEach(sentence => {
    sentence = sentence.trim();
    const p1 = document.createElement("p");

    if (sentence.startsWith("Step")) {
        const match = sentence.match(/^(Step\s*\d*:)(.*)$/);
        if (match) {
            const stepSpan = document.createElement("span");
            stepSpan.classList.add("step-label");
            stepSpan.textContent = match[1];

            const descSpan = document.createElement("span");
            descSpan.textContent = match[2]; 

            p1.appendChild(stepSpan);
            p1.appendChild(document.createTextNode(" ")); 
            p1.appendChild(descSpan);
        } else {
            p1.textContent = sentence; 
        }
    } else {
        p1.textContent = sentence;
    }

    RecipeP1Container.appendChild(p1);

    
});

  // Button
  const nav = document.createElement("div");
  nav.className = "nav-buttons";
  nav.innerHTML = `
    <button class="prev-btn" onclick="setPageIndex(${(pageIndex - 1 + pages.length) % pages.length})">
      <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512">
      <path d="M310.6 233.4c12.5 12.5 12.5 32.8 
        0 45.3l-192 192c-12.5 12.5-32.8 12.5 
        -45.3 0s-12.5-32.8 0-45.3L242.7 256 
        73.4 86.6c-12.5-12.5-12.5-32.8 
        0-45.3s32.8-12.5 45.3 0l192 192z">
        </path>
      </svg>
      <span>Prev</span>
    </button>

    <button class="next-btn" onclick="setPageIndex(${(pageIndex + 1) % pages.length})">
      <span>Next</span>
      <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512">
        <path d="M310.6 233.4c12.5 12.5 12.5 32.8 
        0 45.3l-192 192c-12.5 12.5-32.8 12.5 
        -45.3 0s-12.5-32.8 0-45.3L242.7 256 
        73.4 86.6c-12.5-12.5-12.5-32.8 
        0-45.3s32.8-12.5 45.3 0l192 192z">
        </path>
      </svg>
    </button>
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
