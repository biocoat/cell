'use strict'

const Modal = require('./lib/modal');


module.exports = class CellApplication{
    constructor(){
        this.modal = new Modal();

        
        global.cellApp = this;
        
    }
}