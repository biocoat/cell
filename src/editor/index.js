'use strict'

const path = require('path')
const {ipcRenderer} = require('electron');
const IPC = require("../lib/ipc");

// const Modal = require('./../lib/modal.js');
const Ssh = require('../lib/Ssh');
const FileExplorer = require('../lib/fileExplorer')


const sshBtn = document.getElementById('sshBtn');
// const modal = document.getElementById('myModal');

const ssh = new Ssh();
const fileEx = new FileExplorer();
console.log(global);
var modal = document.getElementById('myModal');
/*
ipcRenderer.on("main-cmd-reply",(event, arg)=>{
  console.log(arg);
});

ipcRenderer.send("main-cmd-async", "Hello There");
*/

console.log(IPC.call('HelloThere',"I have the high ground" ));


// function textSubmit(e) {
//   if (e.keyCode == 13) {
//     modal.getText(function (str) {
//       console.log(str);
//     });
//   }
// }

sshBtn.addEventListener('click', () => {
  // modal.style.display = "block";
  
  ssh.logIn(modal, function(error){
    if(error){
      console.log("SSH error " + error);
      return;
    }
    ssh.readDir("~").then((res)=>{
      console.log(path);
      fileEx.setUsername(res['username'])
      fileEx.update(res["path"],res["dir"]);
      
    });

  });
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

// window.onclick = function (event) {
//   if (event.target == document.getElementById('myModal')) {
//     // modal.style.display = "none";
//     modal.hide();
//   }
// }