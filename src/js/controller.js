import * as model from "./model.js";
import { FORM_CLOSE_SEC } from "./config.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView";
import paginationView from "./views/paginationView.js";
import bookmarkView from "./views/bookmarkView.js";
import addRecipeView from "./views/addRecipeView.js";

//For parcel
import 'core-js/stable';
import 'regenerator-runtime/runtime'

// https://forkify-api.herokuapp.com/v2
///////////////////////////////////////

/**
 * @async
 * @returns {undefined}
 * @description  Controlling the recipe and updating the view
 */
const controlRecipes=async function(){
  try{
    const id=window.location.hash.slice(1);
    
    if(!id) return;

    recipeView.renderSpinner();
    
    //update result view after selcting a result
    resultsView.update(model.getSearchResultPage())
    bookmarkView.update(model.state.bookmarks);
    //Loading recipe
    await model.loadRecipe(id);
    if(!Object.keys(model.state.recipe).length) throw err;

    //rendering recipe 
    recipeView.render(model.state.recipe);

  }catch(err){
    recipeView.renderError();
  }
}

/**
 * @async
 * @returns {undefined}
 * @description  Controlling the search results and updating the view
 */
const controlSearchResults=async function(){
  try{
    resultsView.renderSpinner()

    const query=searchView.getQuery();

    await model.loadSearchResults(query);

    if(!Object.keys(model.state.search.result).length) throw err;

    resultsView.render(model.getSearchResultPage(1))
    paginationView.render(model.state.search);
  }catch(err){ 
    resultsView.renderError();
  }
}

/**
 * 
 * @param {HTMLElement} button Button to be rendered
 * @returns {undefined}
 * @description  Rendering the page buttons
 * 
 */
function renderPageButton(button){
  if(button.classList.contains("pagination__btn--prev") && model.state.search.page>1){
    resultsView.render(model.getSearchResultPage(model.state.search.page-1))
    paginationView.render(model.state.search)
  }
  if(button.classList.contains("pagination__btn--next") && model.state.search.page<model.state.search.result.length){
    resultsView.render(model.getSearchResultPage(model.state.search.page+1));
    paginationView.render(model.state.search);
  }
} 

const servingController=function(num){
  if(num < 1) return;
  model.updateServing(num);
  recipeView.update(model.state.recipe);
}
/**
 * @returns {undefined}
 * @description  Controlling the bookmarks (adding and removing) and updating the view
 */
const controlBookmarks=function(){
  if(model.state.recipe.bookmarked) {model.removeBookmark(model.state.recipe.id);}
  else {model.addBookmark(model.state.recipe);}
  recipeView.update(model.state.recipe);
  bookmarkView.render(model.state.bookmarks);
}

const controlInitBookmarks=function(){
  bookmarkView.render(model.state.bookmarks);
}

/**
 * @returns {void}
 * @description  Clearing bookmarks
 * @author Mohammed Mouloudj
 */
const controlClearBookmarks=function(){
  model.clearBookmarks();
  bookmarkView.render(model.state.bookmarks);
  recipeView.update(model.state.recipe);
}

/**
 * @async
 * @param {Array[]} newRecipe  New recipe to be uploaded
 * @returns {undefined}
 * @description  Uploading a new recipe
 * 
 */
const controlAddRecipe=async function(newRecipe){
  try{
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    bookmarkView.render(model.state.bookmarks);
    recipeView.render(model.state.recipe);
    addRecipeView.renderMessage();
    window.history.pushState(null,"",`#${model.state.recipe.id}`); //changing url
    setTimeout(function(){
      if(!addRecipeView.isHidden()) addRecipeView._toggleWindow();
      addRecipeView.render(model.state.recipe);
    },FORM_CLOSE_SEC*1000);
  }catch(err){
    addRecipeView.renderError(err.message);
    setTimeout(function(){
      if(!addRecipeView.isHidden()) addRecipeView._toggleWindow();
      addRecipeView.render(model.state.recipe);
    },FORM_CLOSE_SEC*1000);
  }
}
const controlRemoveRecipe=async function(){
  try{
    await model.removeRecipe(model.state.recipe);
    window.history.pushState(null,"","#");
    bookmarkView.render(model.state.bookmarks)
    recipeView.renderMessage();
    resultsView.render(model.getSearchResultPage());
  }catch(err){
    recipeView.renderError(err.message);
  }
}

/**
 * @returns {undefined}
 * @description  Initializing the app and adding event listeners to the views (subscribers to the publisher model)
 * 
 */
const init=function(){
  bookmarkView.addHandlerRender(controlInitBookmarks);            //rendering bookmarks on load
  bookmarkView.addHandlerClearbookmark(controlClearBookmarks);    //clearing bookmarks
  recipeView.addHandlerRender(controlRecipes);                    //rendering recipe
  recipeView.addHandlerUpdateServing(servingController);          //updating servings
  recipeView.addHandlerAddBookmark(controlBookmarks);             //adding and removing bookmarks
  searchView.addHandlerSearch(controlSearchResults);              //searching for recipes
  paginationView.addHandlerRender(renderPageButton);              //rendering page buttons
  addRecipeView.addHandlerUpload(controlAddRecipe);               //uploading new recipe
  recipeView.addHandlerRemoveRecipe(controlRemoveRecipe);                   //removing recipe
}
init()