import "regenerator-runtime/runtime";

import { API_URL, RES_PER_PAGE, KEY } from "./config.js";
import { deleteJSON, getJSON, sendJSON } from "./helper.js";

export const state={
    recipe:{},
    search:{
        query:'',
        result:[],
        page:1,
    },
    bookmarks:[],
}

/**
 *
 * @param {Object} data  Data object to be formatted
 * @returns   {Object}  Formatted recipe object
 * @this {Object} model instance
 * @author Mohammed Mouloudj
 */
const recipeFormat=function(data){
    const {recipe}=data.data;
    return{
        id:recipe.id,
        title:recipe.title,
        cookingTime:recipe.cooking_time,
        ingredients:recipe.ingredients,
        servings:recipe.servings,
        image:recipe.image_url,
        publisher:recipe.publisher,
        source:recipe.source_url,
        ...(recipe.key && {key:recipe.key})
    };
}
/**
 * @async
 * @param {String} id   Recipe id to be loaded
 * @returns {undefined}
 * @throws {Error} If the recipe is not found
 * @this {Object} model instance
 * @description  Load the recipe from the API 
 * @author Mohammed Mouloudj
 */
export const loadRecipe=async function(id){
    try{
        const data=await getJSON(`${API_URL}/${id}?key=${KEY}`);  //fetching the recipe data from the API using the recipe id and the API key

        state.recipe=recipeFormat(data);
        
        if(state.bookmarks.some(bookmark=>bookmark.id===id)) state.recipe.bookmarked=true;
        else state.recipe.bookmarked=false;
    }catch(err){
        throw err
    }
}
/**
 * 
 * @param {Object} rmRecipe Recipe to be removed
 * @returns {undefined}
 * @throws {Error} If the recipe is not found
 * @this {Object} model instance
 */
export const removeRecipe=async function(rmRecipe){
    try{
        const id=rmRecipe.id;
        const toRemoveRecipe={
            id,
            title:rmRecipe.title,
            cooking_time:+rmRecipe.cookingTime,
            servings:+rmRecipe.servings,
            image_url:rmRecipe.image,
            publisher:rmRecipe.publisher,
            source_url:rmRecipe.source,
            ingredients:rmRecipe.ingredients,
        }
        await deleteJSON(`${API_URL}/${id}?key=${KEY}`,toRemoveRecipe);
        state.recipe={};
        const index=state.search.result.findIndex(res=>res.id===id)
        state.search.result.splice(index,1);
        removeBookmark(id);
    }catch(err){
        throw err;
    }
}

export const loadSearchResults=async function(query){
    try{
        state.search.query=query;
        const data=await getJSON (`${API_URL}?search=${query}&key=${KEY}`);

        state.search.result= data.data.recipes.map(recipe=>{
            return {
                id:recipe.id,
                title:recipe.title,
                image:recipe.image_url,
                publisher:recipe.publisher,
                ...(recipe.key && {key:recipe.key})
            }
        })

    }catch(err){
        throw err;
    }
}
/**
 * 
 * @param {Number} pageIndex Number of the page to be loaded
 * @returns {Object[]}  Array of recipes to be rendered
 * @this {Object} model instance
 */
export const getSearchResultPage=function(pageIndex=state.search.page){
    state.search.page=pageIndex;
    
    const start=(pageIndex-1)*RES_PER_PAGE;
    const end=pageIndex*RES_PER_PAGE;
    
    return state.search.result.slice(start,end);
}
/**
 * 
 * @param {Number} newServing New serving number
 * @returns {undefined}
 * @this {Object} model instance
 * @description  Update the servings of the recipe
 */
export const updateServing=function(newServing){
    state.recipe.ingredients.forEach(ing=>{
        ing.quantity=(ing.quantity*newServing)/state.recipe.servings
    })
    if(newServing>=1) state.recipe.servings=newServing;
}

const persistBookmarks=function(){
    localStorage.setItem('bookmarks',JSON.stringify(state.bookmarks));
}

export const addBookmark=function(recipe){
    state.bookmarks.push(recipe);
    if(recipe.id===state.recipe.id) state.recipe.bookmarked=true;
    persistBookmarks();
}

export const removeBookmark=function(id){
    const index=state.bookmarks.findIndex(bookmark=>bookmark.id===id);
    state.bookmarks.splice(index,1);
    if(id===state.recipe.id) state.recipe.bookmarked=false;
    persistBookmarks();
}

const retreriveBookmarks=function(){
    const storage=localStorage.getItem('bookmarks');
    if(storage) state.bookmarks=JSON.parse(storage);
}
retreriveBookmarks();

export const clearBookmarks=function(){
    localStorage.clear('bookmarks');
    state.bookmarks.forEach(bookmark=>bookmark.bookmarked=false);
    state.bookmarks=[];
}

/**
 * 
 * @param {Array[]} newRecipe  Array of new recipe data to be uploaded
 * @returns {undefined}
 * @throws {Error} If the ingredient format is wrong
 * @this {Object} model instance
 * @author Mohammed Mouloudj
 */
export const uploadRecipe=async function(newRecipe){
    try{
        const ingredients=Object.entries(newRecipe).filter(entry=>entry[0].startsWith('ingredient') && entry[1]!=='').map(ing=>{
            const ingArr=ing[1].split(',').map(el=>el.trim());
            if(ingArr.length!==3) throw new Error('Wrong ingredient format! Please use the correct format :)');
            if(!ingArr[2]) throw new Error('Wrong ingredient format! Please enter the ingredient description :)');
            const [quantity,unit,description]=ingArr;
            return {quantity:(quantity && isFinite(quantity))?+quantity:null,unit,description}
        });
        const uploadRecipe={
            title:newRecipe.title,
            cooking_time:+newRecipe.cookingTime,
            servings:+newRecipe.servings,
            image_url:newRecipe.image,
            publisher:newRecipe.publisher,
            source_url:newRecipe.sourceUrl,
            ingredients,
        }
        const data=await sendJSON(`${API_URL}?key=${KEY}`,uploadRecipe);
        state.recipe=recipeFormat(data);
        addBookmark(state.recipe);
     }catch(err){
        throw err;
    }
    
}