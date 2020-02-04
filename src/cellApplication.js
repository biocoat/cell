'use strict'
const IPC = require("./lib/ipc");
const Ssh = require("./lib/ssh");
const logger = require("./logger");
const Window = require('./lib/window');

const path = require('path');
const {
    CompositeDisposable,
    Disposable
} = require('event-kit');

const {
    EventEmitter
} = require('events');
//settings

const { BrowserWindow, ipcMain} = require('electron');

let mainWindow;
module.exports = class CellApplication {
    constructor() {

        this.ssh = new Ssh();

        global.cellApp = this;

        this.disposable = new CompositeDisposable();
        this.initEventHandle();

    }

    async createMainWindow(){
        mainWindow = new Window({
            file: 'src/editor/index.html'
        });

        mainWindow.on('closed', () => {
            mainWindow = null;
        })
    }

    quit(callback){
        this.destroy();
        callback();
    }

    async destroy() {
        this.disposable.dispose();
    }

    activate(){
        if(mainWindow === null) {
            this.createMainWindow();
        }
    }

    initEventHandle() {

        /*Test IPC emitters using HelloThere
            Example call: 
            console.log(IPC.call('HelloThere'));
        */
        this.disposable.add(
            IPC.on(ipcMain, "HelloThere", (path) => {
                logger.info("AH! General Kenobi. A bold one " + (path))
            })
        );


        // this.disposable.add(
        //     IPC.respondTo('modal-interact', () = > {

        //     })
        // );

        this.disposable.add(
            IPC.on(ipcMain, "ssh-path-switch", (event, responseChannel) => {
                logger.info("ssh-path-switch");

            })
        );
    
        this.disposable.add(
            IPC.on(ipcMain, "loading-cursor", () => {

            })
        )

    }
}