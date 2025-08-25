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
      img: "picture/NasiLemak3.jpg",
      p1: "Step 1: Set up a tiered steamer (see notes), filling the bottom section with about 3 inches of water. Bring to a boil over high heat. Line the steamer tier with cheesecloth. Step 2: Meanwhile, place the rice in a strainer and rinse the grains under running water until the water is almost clear. Drain rice, then transfer to a 10-inch nonstick skillet and add the coconut milk, 7 ounces (200ml) water, pandan leaves, ginger, and salt.Cook on medium heat, stirring continuously, until it thickens like rice pudding, 8-10 minutes. Step 3: Transfer the rice mixture to the cheesecloth-lined steamer tier and spread it in a roughly even layer. Set steamer tier over bottom section of boiling water, cover, and steam over medium heat until the grains are fully cooked, about 45 minutes; start checking rice doneness after 35 minutes of steaming. Once the rice reaches your preferred texture, turn off the heat and leave it to continue steaming, covered, until the steaming stops. The rice should be just cooked, with separate grains and a rich flavor of coconut. Step 4: Serve with sambal tumis and other nasi lemak accompaniments, depending on your preference (note that it's typical to leave the pandan leaves in the nasi lemak, as it's understood they will be removed at the table by the diner; do not eat them). If desired, nasi lemak can be served on a banana leaf, which will contribute its own fragrance to the dish as the rice and toppings are eaten. ",
    },
  },
  {
    food: {
      title: "Mango Sticky Rice",
      text: "A traditional Southeast Asian and South Asian dessert made with glutinous rice, fresh mango and coconut milk.",
      img: "picture/MangoRice2.jpg"
    },
    ingredients: {
      p1: "185g sticky rice. 350ml  water. 1 can coconut milk (400ml). 50g brown sugar + 1 tablespoon. ½ teaspoon salt. 1 teaspoon cornstarch. 1-2 large, ripe mangos (sliced or cubed). Sesame seeds (optional)."
    },
    recipe: {
      img: "picture/MangoRice3.jpg",
      p1: "Step 1: Wash the rice, changing the water between mixes until it runs clear. Cover with 350g clean water and soak your rice for 40 minutes, up to a few hours. Step 2: If steaming, drain the water and flatten your rice in a steaming basket. Steam for 30 to 40 minutes. If boiling, transfer your water and rice into a saucepan and bring to a boil. Once boiling, reduce to a simmer and cover with a lid. Simmer for 20-30 minutes, or until the water is absorbed. Step 3: While the rice cooks, reserve 60ml of coconut milk in a bowl and pour the rest into a small saucepan and combine with sugar and salt. Bring to just below boiling and stir until the sugar has dissolved, then remove from the heat. Step 4: Transfer your cooked rice to a bowl and stir in the coconut mixture. Cover and leave for 30 minutes for the liquid to be absorbed. Step 5: While your mixture sits, combine a splash of the remaining coconut milk to your cornstarch and mix into a slurry. Then pour the slurry, 1 tablespoon sugar, a pinch of salt, and the rest of the reserved coconut milk into a small, clean saucepan and heat gently until it thickens. Set it aside. Step 6: Time to put your mango sticky rice together. Use a small bowl to mould a quarter of your rice mixture onto the plate and divide mango amongst the servings. Pour coconut sauce over the top of your rice, sprinkle with sesame seeds if using, and enjoy."
    }
  },
  {
    food: {
      title: "Taco",
      text: "A traditional Mexican dish consisting of a small hand-sized corn- or wheat-based tortilla topped with a filling.",
      img: "picture/Taco2.jpg"
    },
    ingredients: {
      p1: "8 small corn or flour tortillas. 300g beef, chicken, or pork (sliced or shredded). 1 tbsp vegetable oil. 1 tsp chili powder. 1 tsp cumin. 1 tsp paprika. 1/2 tsp salt. 1/2 tsp black pepper. 1 onion, diced. 2 cloves garlic, minced. 1 tomato, diced. 1/2 cup shredded lettuce. 1/2 cup shredded cheese. 1/4 cup sour cream. Fresh cilantro (for garnish). Lime wedges (for serving)",
    },
    recipe: {
      img: "picture/Taco3.jpg",
      p1: "Step 1: Preheat the oven to 425 degrees F (220 degrees C). Line a rimmed baking sheet with foil or parchment paper and lightly coat with 1 tablespoon olive oil. Step 2: Combine beef, onion, green chiles, chili powder, cumin, garlic powder, and salt in a medium bowl and mix until well incorporated. Step 3: Wrap tortillas in a damp paper towel and microwave just until softened, about 30 seconds. Step 4: Spread about 3 tablespoons beef mixture over half of a tortilla in a very thin layer that reaches to the edges  Spread about 1 tablespoon beans onto the other half. Sprinkle all over with about 2 tablespoons cheese. Fold tortilla in half to make a taco; place on prepared baking sheet. Repeat with remaining tortillas, meat and cheese. Brush tops of tacos with remaining oil. Step 5: Bake tacos in the preheated oven, flipping halfway through, until lightly browned, toasted, and crisp around the edges, 30 to 35 minutes. Serve with desired toppings."
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

  const recipeImg = clone.querySelector(".recipe-img-src");
  if (page.recipe.img) {
    recipeImg.src = page.recipe.img; 
    recipeImg.alt = "Recipe of " + page.food.title;
  } else {
    recipeImg.style.display = "none"; 
  }

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
  window.scrollTo({ top: 0 });
}

window.addEventListener("popstate", renderPage);

document.addEventListener("DOMContentLoaded", renderPage);
