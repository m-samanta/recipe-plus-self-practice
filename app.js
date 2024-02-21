// Top search bar visibility
function searchActive(value) {
  const input = document.querySelector(".nav__input");
  input.focus();
}

// Search via pressing Enter
async function searchBarEnter(event) {
  let value = document.querySelector(".nav__input").value;
  const input = document.querySelector(".nav__input");

  if (event.keyCode == 13) {
    if (input === document.activeElement) {
      searchResult(value);
      await recipesSearch(value);
      return setTimeout(() => loadingDone(), 1000);
    }
    value = document.querySelector(".recipe__input").value;
    searchResult(value);
    await recipesSearch(value);
    setTimeout(() => loadingDone(), 1000);
  }
}

// Search via clicking search icon
async function searchBarClick() {
  const value = document.querySelector(".recipe__input").value;

  searchResult(value);
  await recipesSearch(value);
  setTimeout(() => loadingDone(), 1000);
}

// Value/text of the search & search title visibility
function searchResult(value) {
  const searchBar = document.querySelector(".recipes__top");

  const searchResult = document.querySelector(".recipe__search__result");

  const searchBarHTML = `<h2 class="recipes__top__title">
    Search results for:
  </h2>
  <h2 class="recipe__search__result">"${value}"</h2>`;

  searchBar.innerHTML = searchBarHTML;

  searchBar.classList.add(
    "recipe__search__result-visible",
    "recipes__top__title-visible",
    "recipes__top__title__landing-invisible"
  );
}

// For storing api data
let globalRecipesData = [];

// Fetching/storing data from api based on the search input, making changes to html accordingly & displaying spinner
async function recipesSearch(value) {
  const response = await fetch(
    `https://themealdb.com/api/json/v1/1/search.php?s=${value}`
  );
  const searchResults = await response.json();
  const mealsArray = searchResults.meals.slice(0, 6);

  globalRecipesData = mealsArray;

  const recipes = document.querySelector(".recipes__list");

  const recipesHTML = mealsArray
    .map(
      (meal) => `
    <div class="recipe recipe__invisible" onclick= "openRecipes()"data-id="${meal.idMeal}">
      <figure class="recipe__img__wrapper">
        <img src="${meal.strMealThumb}" alt="" class="recipe__img">
        <h3 class="recipe__info__title">${meal.strMeal}</h3>
        <div class="recipe__info__list">
          <div class="recipe__info recipe__info1">
            <i class="fa-solid fa-earth-americas recipe__info__icon"></i>
            <p class="recipe__info__text">${meal.strArea}</p>
          </div>
          <div class="recipe__info recipe__info2">
            <i class="fa-solid fa-star recipe__info__icon"></i>
            <p class="recipe__info__text">${meal.strCategory}</p>
          </div>
          <div class="recipe__info recipe__info3">
            <i class="fa-solid fa-list"></i>
            <p class="recipe__info__text">${meal.strIngredient1}...</p>
          </div>
        </div>
      </figure>
      <h4 class="recipe__title">${meal.strMeal}</h4>
    </div>
    </div>
  `
    )
    .join("");

  recipes.innerHTML =
    `<i class="fa-solid fa-spinner recipes__list__loading recipes__list__loading-visible"></i>` +
    recipesHTML;
}

// Removing spinner & displaying search results
function loadingDone() {
  const targetRecipe = document.querySelectorAll(".recipe");

  const targetLoading = document.querySelector(".recipes__list__loading");

  targetLoading.classList.remove("recipes__list__loading-visible");
  targetRecipe.forEach((recipe) =>
    recipe.classList.remove("recipe__invisible")
  );
}

// Opening recipe details & making background 'static'
function openRecipes() {
  const body = document.body;
  body.classList.add("open");

  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";
}

// Closing recipe details & making backgroud 'responsive'
function closeRecipes() {
  const body = document.body;
  body.classList.remove("open");

  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";
}

// Closing recipe details only when non content area is clicked
document
  .querySelector(".recipes__details")
  .addEventListener("click", function (event) {
    if (event.target === event.currentTarget) {
      closeRecipes();
    }
  });

// Listening to which meal is being clicked
document.addEventListener("DOMContentLoaded", (event) => {
  const recipesContainer = document.querySelector(".recipes__list");

  if (recipesContainer) {
    recipesContainer.addEventListener("click", function (e) {
      const targetRecipe = e.target.closest(".recipe");
      if (targetRecipe) {
        const recipeId = targetRecipe.dataset.id;
        displayRecipeDetails(recipeId);
      }
    });
  }
});

// Accessing data from stored data & making changes to html based on which meal is being clicked
function displayRecipeDetails(recipeId) {
  const recipeDetails = globalRecipesData.find(
    (recipe) => recipe.idMeal === recipeId
  );
  const recipesDetailContainer = document.querySelector(".recipes__detail");

  if (recipeDetails && recipesDetailContainer) {
    let ingredientsHTML = "";

    for (let i = 1; i <= 20; i++) {
      const ingredient = recipeDetails[`strIngredient${i}`];
      const measure = recipeDetails[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== "" && measure) {
        ingredientsHTML += `
          <div class="recipe__detail recipe__detail3">
            <p class="recipe__detail__text2">${ingredient} - ${measure}</p>
          </div>`;
      }
    }

    const instructions = recipeDetails.strInstructions
      .split(". ")
      .filter(Boolean);
    let instructionsHTML = '<ul class="recipe__detail__instructions">';
    instructions.forEach((instruction) => {
      if (!instruction.trim().endsWith(".")) instruction += ".";
      instructionsHTML += `<li>${instruction}</li>`;
    });
    instructionsHTML += "</ul>";

    recipesDetailContainer.innerHTML = `
      <div class="recipes__details__head">
        <div class="recipes__detail__head1">
          <figure class="recipe__detail__img__wrapper">
            <img
              src="${recipeDetails.strMealThumb}"
              alt=""
              class="recipe__detail__img"
            />
          </figure>
          <div class="recipes__detail__head__info">
            <div class="recipes__detail__info__inner">
            <h3 class="recipe__detail__title">${recipeDetails.strMeal}</h3>
            <div class="recipe__detail recipe__detail1">
              <p class="recipe__detail__text1">${recipeDetails.strArea}</p>
            </div>
            <div class="recipe__detail recipe__detail2">
              <p class="recipe__detail__text1">${recipeDetails.strCategory}</p>
            </div>
            </div>
          </div>
        </div>
        <div class="recipes__detail__head2">
          <div class="recipes__detail__ingredients">
            <div class="recipes__detail__info">
              <div class="recipe__detail__list">
                ${ingredientsHTML}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="recipes__detail__info">
        <div class="recipe__detail recipe__detail4">
          ${instructionsHTML}
        </div>
      </div>
    `;
  }
}
