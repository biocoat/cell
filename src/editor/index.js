'use strict'
const {
  BrowserWindow
} = require('electron').remote
const path = require('path')
// const Modal = require('./../lib/modal.js');
const Ssh = require('../lib/Ssh')



const newWindowBtn = document.getElementById('new-window');
const sshBtn = document.getElementById('sshBtn');
// const modal = document.getElementById('myModal');

const ssh = new Ssh();
console.log(global);
var modal = document.getElementById('myModal');

newWindowBtn.addEventListener('click', (event) => {
  const modalPath = path.join('file://', __dirname, './connect.html')
  let win = new BrowserWindow({
    width: 400,
    height: 320,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.on('close', () => {
    win = null
  })
  win.loadURL(modalPath)
  win.show()
})



// function textSubmit(e) {
//   if (e.keyCode == 13) {
//     modal.getText(function (str) {
//       console.log(str);
//     });
//   }
// }

sshBtn.addEventListener('click', (event) => {
  // modal.style.display = "block";
  console.log(modal);
  ssh.logIn(modal);
  // modal.display();
  // const modalPath = path.join('file://', __dirname, 'cmdpalette.html');
  // let win = new BrowserWindow({
  //   width : 200,
  //   height: 100,
  //   frame : false
  // });
  // win.on('close', () => { win = null })
  // win.loadURL(modalPath)
  // win.show()
});

window.onclick = function (event) {
  if (event.target == document.getElementById('myModal')) {
    // modal.style.display = "none";
    modal.hide();
  }
}