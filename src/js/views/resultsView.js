import View from "./view.js";
import previewView from "./previewView.js";
import icons from "url:../../img/icons.svg";

class ResultsView extends View{
    constructor(){
        super(document.querySelector('.results'),'No recipes found for your query!')
    }

    _generateMarkup(){
      return this._data.map((result)=>previewView.render(result,false)).join('');
    }
}

export default new ResultsView();