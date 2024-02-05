import View from "./view.js";

class SearchView extends View{
    constructor(){
        super(document.querySelector('.search'))
    }

    getQuery(){
        const query= this.parentElement.querySelector('.search__field').value;
        this.#clearInput();
        return query
    }

    #clearInput(){
        this.parentElement.querySelector('.search__field').value='';
    }

    addHandlerSearch(handler){
        this.parentElement.addEventListener("submit",function(e){
            e.preventDefault()
            handler();
        });
        this.#clearInput()
    }
}

export default new SearchView();