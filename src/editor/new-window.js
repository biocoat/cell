const {BrowserWindow} = require('electron').remote
const path = require('path')
const CellGlobal = require("../cell-global");

const newWindowBtn = document.getElementById('new-window')

newWindowBtn.addEventListener('click', (_event) => {
  console.log(CellGlobal.settingsPath);
  const modalPath = path.join('file://', __dirname, '../modals/ssh-login.html')
  let win = new BrowserWindow({ width: 400, height: 320, webPreferences: {nodeIntegration:true}})

  win.on('close', () => { win = null })
  win.loadURL(modalPath)
  win.show()
})