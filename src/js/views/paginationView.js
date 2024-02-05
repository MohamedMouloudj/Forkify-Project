import View from "./view.js";
import icons from 'url:../../img/icons.svg';
import { RES_PER_PAGE } from "../config.js";

class paginationView extends View{
    constructor(){
        super(document.querySelector(".pagination"));
    }

    addHandlerRender(handler){
        this.parentElement.addEventListener("click",ev=>{
            const btn=ev.target.closest(".btn--inline");
            if(!btn) return;
            handler(btn);
        });

        window.addEventListener("keydown",ev=>{
            if(ev.key=="ArrowLeft"){
                const btn=this.parentElement.querySelector(".pagination__btn--prev");
                if(!btn) return;
                handler(btn);
            }
            if(ev.key=="ArrowRight"){
                const btn=this.parentElement.querySelector(".pagination__btn--next");
                if(!btn) return;
                handler(btn);
            }
        });
    }

    _generateMarkup(){
        const numPages=Math.ceil(this._data.result.length/RES_PER_PAGE);

        if(this._data.page==1 && numPages>1){
            return `
          <button class="btn--inline pagination__btn--next">
            <span>Page ${this._data.page+1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
        }
        if(numPages>this._data.page){
            return `<button class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._data.page-1}</span>
          </button>
          <button class="btn--inline pagination__btn--next">
            <span>Page ${this._data.page+1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
        }
        if(this._data.page==numPages && numPages>1){
            return `<button class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._data.page-1}</span>
          </button>`;
        }
        return '';
    }
    
}

export default new paginationView(); 