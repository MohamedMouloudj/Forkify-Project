import View from "./view.js";
import previewView from "./previewView.js";
import icons from "url:../../img/icons.svg";

class BookmakView extends View{
    constructor(){
        super(document.querySelector('.bookmarks__list'),'No bookmarks yet. Find a nice recipe and bookmark it :)')
    }

    addHandlerRender(handler){
        window.addEventListener('load',handler);
    }

    addHandlerClearbookmark(handler){  
        this.parentElement.previousElementSibling.addEventListener('click',function(){
            handler();
        })
    }

    _generateMarkup(){
        return this._data.map((result)=>previewView.render(result,false)).join('');
    }
}

export default new BookmakView();