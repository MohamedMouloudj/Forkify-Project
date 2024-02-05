import icons from 'url:../../img/icons.svg';

export default class View{
    _data;
    _generateMarkup(){};
    constructor(parentElement,errorMessage=''){
        this.parentElement=parentElement;
        this.errorMessage=errorMessage;
    }
    /**
     * Render the received object to the DOM
     * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
     * @param {boolean} [isRender=true] If false, create markup string instead of rendering to the DOM
     * @returns {undefined | string} A markup string is returned if isRender=false
     * @this {Object} View instance
     * @author Mohammed Mouloudj
     */
    render(recipe ,isRender=true){
        if(!recipe || Array.isArray(recipe) && recipe.length===0) return this.renderError();
        this._data=recipe;
        const markup=this._generateMarkup();
        if(isRender==false) return markup;
        this.#clearContainer();
        this.parentElement.insertAdjacentHTML("afterbegin", markup);
    }
    /**
     * 
     * @param {Object} recipe recipe object to be updated in the DOM
     * @returns {undefined}
     */
    update(recipe){

        this._data=recipe;

        const newMarkup=this._generateMarkup();
        const newDOM=document.createRange().createContextualFragment(newMarkup);

        const newElements=Array.from(newDOM.querySelectorAll('*')); //new elements
        const curElement=Array.from(this.parentElement.querySelectorAll('*'));  //current elements
        
        newElements.forEach((el,index)=>{

            if(!curElement[index].isEqualNode(el) && el.firstChild?.nodeValue.trim() !==''){
                curElement[index].textContent=el.textContent;
            }
            if(!el.isEqualNode(curElement[index])){
                Array.from(el.attributes).forEach(att=>curElement[index].setAttribute(att.name,att.value))  //copying attributes
            }
        })

    }

    /**
     * @description Clear the container
     * @returns {void}
     * @this {Object} View instance
    */
    #clearContainer(){
        this.parentElement.innerHTML='';
    }
    /**
     * @description Render the spinner
     * @returns {void}
     * @this {Object} View instance
     */
    renderSpinner(){
        const markup=`
            <div class="spinner">
            <svg>
                <use href="${icons}#icon-loader"></use>
            </svg>
            </div>
            `;
        this.#clearContainer();
        this.parentElement.insertAdjacentHTML('afterbegin',markup);
    }


    /**
     * 
     * @param {String} errorMessage  Error message to be rendered
     * @returns {void}
     * @this {Object} View instance
     */
    renderError(errorMessage=this.errorMessage){
        const markup=`
            <div class="error">
                <div>
                    <svg>
                        <use href="${icons}#icon-alert-triangle"></use>
                    </svg>
                </div>
                <p>${errorMessage}</p>
            </div>`;
        this.#clearContainer();
        this.parentElement.insertAdjacentHTML("afterbegin", markup);
    }
    /**
     * 
     * @param {String} message  Message to be rendered
     * @returns {void}
     * @this {Object} View instance
     */
    renderMessage(message=this.message){
        const markup=`
            <div class="message">
                <div>
                    <svg>
                        <use href="${icons}#icon-smile"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>`;
        this.#clearContainer();
        this.parentElement.insertAdjacentHTML("afterbegin", markup);
    }
}