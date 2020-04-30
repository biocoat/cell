'use strict'
const { ipcRenderer } = require('electron')
ipcRenderer.on('ssh-data-in', (event, message) => {
    term.write(message);
    console.log(message) // Prints 'whoooooooh!'
  })

module.exports = class Modal {
    constructor(modal, textbox) {
        this.modal = modal;
        this.textbox = textbox;
        this.isVisible = false;
        this.submitCallback = null;

        //if  defined,  run the rest
        if(modal){
            this.setupEventListener();
        }
        // ipcRenderer.on('modal-display', (event, message) => {
        //     this.setPlaceholder(message);
        //     this.setSubmitCallback(function(res){
        //         ipcRenderer.send('modal-input', res);
        //     })
        //     console.log(message) // Prints 'whoooooooh!'
        //   })

            
    }

    bind(modal, textbox){
        this.modal = modal;
        this.textbox = textbox;
        this.setupEventListener();

    }

    setupEventListener(){
        const modalClass = this;
        this.textbox.addEventListener("keyup", function (event) {
            if (event.code == "Enter") {
                //referneces a local variable which resolved to the class
                if (modalClass.submitCallback == null){
                    console.log("sumbit Callbakc is NULL")
                    return;
                }    
                modalClass.submitCallback(this.value);

            }
            else{
                if(event.code == "Escape"){
                    modalClass.hide();
                }
            }
        })
    }


    setSubmitCallback(cb) {
        this.submitCallback = cb;
    }

    display(placeholder) {

        //delete text
        this.textbox.value = "";

        //set placeholder if placeholder is defined
        if (placeholder != null) {
            this.textbox.placeholder = placeholder;
        }
        //change to visibile
        this.modal.style.display = "block";
        this.isVisible = true;
    }

    setPlaceholder(placeholder) {
        this.textbox.value = "";
        this.setTypeText();
        if (placeholder.toLocaleLowerCase().includes('password')) {
            this.setTypePassword();
        }
        this.textbox.placeholder = placeholder;
    }

    hide() {
        this.modal.style.display = "none";
        // this.submit = null;
        this.submitCallback = null;
        this.setTypeText();

        this.isVisible = false;
    }

    getVisibility() {
        return this.isVisible;
    }

    getText(callback) {
        callback(this.textbox.value)
    }

    setTypePassword() {
        this.textbox.type = "password";
    }

    setTypeText() {
        this.textbox.type = "text";
    }

    //@requires reset submit to NULL when finished. Nevermind. hide resets 
    //Use when a special return function is neccessary.
    // setSubmitFunction(submit){
    //     this.submit = submit;
    // }

}