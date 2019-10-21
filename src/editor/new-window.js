const {BrowserWindow} = require('electron').remote
const path = require('path')

const newWindowBtn = document.getElementById('new-window')

newWindowBtn.addEventListener('click', (_event) => {
  const modalPath = path.join('file://', __dirname, './connect.html')
  let win = new BrowserWindow({ width: 400, height: 320, webPreferences: {nodeIntegration:true}})

  win.on('close', () => { win = null })
  win.loadURL(modalPath)
  win.show()
})