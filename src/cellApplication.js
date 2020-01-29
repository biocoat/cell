'use strict'
const IPC = require("./lib/ipc");
const Ssh = require("./lib/ssh");
const logger = require("./logger");

const path = require('path');
const {
    CompositeDisposable,
    Disposable
} = require('event-kit');
const {
    EventEmitter
} = require('events');
//settings

const {
    BrowserWindow,
    ipcMain,
    app
} = require('electron');

module.exports = class CellApplication {
    constructor() {

        this.ssh = new Ssh();

        global.cellApp = this;

        this.disposable = new CompositeDisposable();
        this.initEventHandle()


    }

    async destroy() {
        this.disposable.dispose();
    }

    initEventHandle() {

        /*Test IPC emitters using HelloThere
            Example call: 
            console.log(IPC.call('HelloThere'));
        */
        this.disposable.add(
            IPC.on(ipcMain, "HelloThere", () => {
                logger.info("AH! General Kenobi. A bold one")
            })
        );

        this.disposable.add(
            IPC.on(ipcMain, "ssh-path-switch", (event, responseChannel) => {
                logger.info("ssh-path-switch");
                
            })
        )
    }
}