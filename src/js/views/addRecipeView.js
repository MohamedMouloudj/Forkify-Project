import View from "./view.js";
import icons from 'url:../../img/icons.svg';
import { RES_PER_PAGE } from "../config.js";

class addRecipeView extends View{
    constructor(){
        super(document.querySelector(".upload"));
        this._window= document.querySelector(".add-recipe-window");
        this._overlay= document.querySelector(".overlay");
        this._btnOpen= document.querySelector(".nav__btn--add-recipe");
        this._btnClose= document.querySelector(".btn--close-modal");
        this.message="Recipe was successfully uploaded !";
        this.ingNum=7;
        this._addHandlerShowWindow();
        this._addHandlerCloseWindow();
        this._addHandlerAddIngredient();
    }

    isHidden(){
        return this._overlay.classList.contains("hidden");
    }
    _toggleWindow(){
        this._window.classList.toggle("hidden");
        this._overlay.classList.toggle("hidden");
    }

    _addHandlerShowWindow(){
        this._btnOpen.addEventListener("click",this._toggleWindow.bind(this));
    }
    _addHandlerCloseWindow(){
        this._btnClose.addEventListener("click",this._toggleWindow.bind(this));
        this._overlay.addEventListener("click",this._toggleWindow.bind(this));
    }

    addHandlerUpload(handler){
        this.parentElement.addEventListener("submit",function(e){
            e.preventDefault();
            const dataArr=[...new FormData(this)];  //this refers to the form element, FormData is a built in object that takes the form data and returns an array of arrays (map)
            const data=Object.fromEntries(dataArr); //Object.fromEntries takes an array of arrays and returns an object (opposite of Object.entries)
            handler(data);
        })
    }

    _generateIngredientInputMarkup(){
        return`
        <label>Ingredient ${this.ingNum}</label>
          <input
            type="text"
            name="ingredient-${this.ingNum}"
            placeholder="Format: 'Quantity,Unit,Description'"
        />`;
    }

    renderIngredientInput(event){
        event.preventDefault();
        this.ingNum++;
        const markup=this._generateIngredientInputMarkup();
        this.parentElement.querySelector(".upload__ing-column").insertAdjacentHTML("beforeend",markup);
    }

    _addHandlerAddIngredient(){
        this.parentElement.querySelector(".upload__add-recipe").addEventListener("click",this.renderIngredientInput.bind(this));
    }

    _generateMarkup(){
        return `
        <form class="upload">
        <div class="upload__column">
          <h3 class="upload__heading">Recipe data</h3>
          <label>Title</label>
          <input required name="title" type="text" />
          <label>URL</label>
          <input required name="sourceUrl" type="text" placeholder="*At least 5 characters"/>
          <label>Image URL</label>
          <input required name="image" type="text"/>
          <label>Publisher</label>
          <input required name="publisher" type="text" />
          <label>Prep time</label>
          <input required name="cookingTime" type="number" placeholder="*More than 0"/>
          <label>Servings</label>
          <input required name="servings" type="number" placeholder="*More than 0"/>
        </div>

        <div class=" upload__column-ingredient">
          <div class="upload__heading upload__ing-heading-container">
            <h3 class="upload__ing-heading">Ingredients</h3>
            <button class="upload__add-recipe">
                <svg class="add__icon">
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
            </button>
          </div>
          <div class="upload__ing-column">
            <label>Ingredient 1</label>
            <input
              type="text"
              required
              name="ingredient-1"
              placeholder="Format: 'Quantity,Unit,Description'"
            />
            <label>Ingredient 2</label>
            <input
              type="text"
              name="ingredient-2"
              placeholder="Format: 'Quantity,Unit,Description'"
            />
            <label>Ingredient 3</label>
            <input
              type="text"
              name="ingredient-3"
              placeholder="Format: 'Quantity,Unit,Description'"
            />
            <label>Ingredient 4</label>
            <input
              type="text"
              name="ingredient-4"
              placeholder="Format: 'Quantity,Unit,Description'"
            />
            <label>Ingredient 5</label>
            <input
              type="text"
              name="ingredient-5"
              placeholder="Format: 'Quantity,Unit,Description'"
            />
            <label>Ingredient 6</label>
            <input
              type="text"
              name="ingredient-6"
              placeholder="Format: 'Quantity,Unit,Description'"
            />
            <label>Ingredient 7</label>
            <input
              type="text"
              name="ingredient-7"
              placeholder="Format: 'Quantity,Unit,Description'"
            />
          </div>
        </div>

        <button class="btn upload__btn">
          <svg>
            <use href="${icons}#icon-upload-cloud"></use>
          </svg>
          <span>Upload</span>
        </button>
      </form>`;
    }
    
}

export default new addRecipeView(); 