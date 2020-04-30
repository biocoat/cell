'use strict'

//https://developers.google.com/web/fundamentals/web-components/examples/howto-tabs

class PanelElement extends HTMLElement{
    constructor(){
        super();

        this.addEventListener('mouseup', function(event){
            console.log("Mouse up");
        })
        // this.style.height = "inherit";
    }
}

customElements.define('cell-panel', PanelElement);