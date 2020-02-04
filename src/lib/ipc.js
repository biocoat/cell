//Atom's ipchelper.js 
//https://github.com/atom/atom/blob/master/src/ipc-helpers.js
'use strict'


// const {ipcMain} = require('electron');
const Disposable = require('event-kit').Disposable;
let ipcRenderer = null;
let ipcMain = null;
let ipcChannelId = 0;

let BrowserWindow = null;

exports.on = function (emitter, eventName, callback) {
    emitter.on(eventName, callback);
    return new Disposable(() => emitter.removeListener(eventName, callback));
}


exports.call = function (channel, ...args) {
    if (!ipcRenderer) {
        ipcRenderer = require('electron').ipcRenderer;
        ipcRenderer.setMaxListeners(10);
    }

    const responseChannel = `ipc-res-${ipcChannelId}`;
    ipcChannelId++;

    return new Promise(resolve => {
        ipcRenderer.on(responseChannel, (event, result) => {
            ipcRenderer.removeAllListeners(responseChannel);
            resolve(result);
        });
        ipcRenderer.send(channel, responseChannel, ...args);
    })
};

exports.respondTo = function (channel, callback) {
    if (!ipcMain) {
        const electron = require('electron');
        ipcMain = electron.ipcMain;
        BrowserWindow = electron.BrowserWindow;
    }

    return exports.on(
        ipcMain,
        channel,
        async (event, responseChannel, ...args) => {
            const browserWindow = BrowserWindow.fromWebContents(event.sender);
            const result = await callback(browserWindow, ...args);
            if (!event.sender.isDestroyed()) {
                event.sender.send(responseChannel, result);
            }
        }
    );
};