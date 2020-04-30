'use strict'
const IPC = require("./lib/ipc");
const Ssh = require("./lib/ssh");
const logger = require("./logger");
const Window = require('./lib/window');

const {CompositeDisposable} = require('event-kit');

// const {EventEmitter} = require('events');
//settings

const {ipcMain} = require('electron');

let mainWindow;
let xtermTest;
module.exports = class CellApplication {
    constructor() {

        this.ssh = null;
        
        global.cellApp = this;

        this.disposable = new CompositeDisposable();
        this.initEventHandle();

    }

    async createMainWindow(){
        mainWindow = new Window({
            file: 'src/editor/index.html'
            // file: 'src/forms/form.html'
            // file: 'src/editor/term.html'
        })
        .on('closed', () => {
            logger.debug("Main window was closed");
            mainWindow = null;
        });
        this.ssh = new Ssh(mainWindow);

        // xtermTest = new Window({
        //     file: 'src/editor/term.html'
        // })

    }

    quit(callback){
        this.disposable.dispose();
        this.ssh.end();
        callback();
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