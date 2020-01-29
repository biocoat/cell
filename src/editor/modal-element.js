'use strict'

//https://developers.google.com/web/fundamentals/web-components/examples/howto-tabs
/*

const template = document.createElement('template');
template.innerHTML = `
<style>

</style>
<slot name="tab"></slot>
<slot name="panel"></slot>
`;

*/
class ModalElement extends HTMLInputElement {
    constructor(){
        super();

        this.setAttribute('class', 'modal-element');

        this.isVisible = false;
        this.style.display = "none";
        this.value = "hello there"
        this.submitCallback = () => {
            console.log("Enter was pressed")
        };


        this.addEventListener("keyup", function(event){
            if(event.code == "Enter"){
                if(this.submitCallback == null) return;
                this.submitCallback(this.value);        
            }else if(event.code == "Escape"){
                this.hide()
            }
        });

    }

    setSubmitCallback(cb){
        this.submitCallback = cb;
    }

    setPlaceholder(placeholder){
        this.value = "";
        this.type  = "text";
        if(placeholder.toLocaleLowerCase().includes('password')){
            this.type = "password";
        }
        this.placeholder = placeholder;
        
    }
    display(placeholder){
        this.value = "";
        if(placeholder != null){
            this.setPlaceholder(placeholder);
        }
        
        this.isVisible = true;
        this.style.display = "block";
        this.focus();
    }

    hide(){
        this.style.display = "none";
        this.submitCallback = () => {
            console.log("Enter was pressed")
        };
    }
}

customElements.define('modal-box',ModalElement, {extends: 'input'});


