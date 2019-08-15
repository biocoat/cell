'use strict'

const {BrowserWindow} = require('electron');
// const storage = require('electron-json-storage');
// const path = require('path');

// let settings = Settings();
// console.log('HELLO');
// storage.setDataPath(path.join(__dirname, 'settings.json'));
// console.log(storage.getDataPath());
// var backgroundColor;
// console.log(storage.get('backgroundColor',function(data){
//     console.log("THere");
//     console.log(data);
//     backgroundColor = data;
// }  ));
const defaultProps = {
    width:860,
    height: 720,
    show: false,
    webPreferences: {
        nodeIntegration: true
    }
    // backgroundColor: '#3d3a35'
};

class Window extends BrowserWindow{
    constructor ({ file, ...windowSettings}){
        super({...defaultProps, ...windowSettings})

        this.loadFile(file);
        // this.webContents.openDevTools();

        this.once('ready-to-show', () =>{
            this.show();
        });
    }
}

module.exports = Window;