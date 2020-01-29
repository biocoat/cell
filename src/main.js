const electron = require('electron')
// const {Menu, MenuItem} = require('electron')
// Module to control application life.
const app = electron.app
const CellMenu = require('./menu');
const CellApplication = require("./cellApplication");

// const menu = new Menu();


const Window = require('./lib/window');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

var cellApp = new CellApplication();
// let modal = new Modal();
console.log(process.versions);

function init(){
  var cellMenu = new CellMenu();
  cellMenu.initMenu();
  // console.log(global);
  createWindow();
}


function createWindow () {

  let mainWindow = new Window({
    file: 'src/editor/index.html'
  });

  
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', init)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // eslint-disable-next-line no-undef
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


