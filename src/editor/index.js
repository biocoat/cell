'use strict'

const FileExplorer = require('../lib/fileExplorer')

const fileEx = new FileExplorer()
const sshBtn = document.getElementById('sshBtn');
const refreshBtn = document.getElementById('refreshBtn');

var modal = document.getElementById('myModal');

fileEx.on("fileExplorer-loading", () => {
  console.log("LOADING");
  document.body.classList.add('body-progress');
});

fileEx.on("fileExplorer-done", () =>{
  document.body.classList.remove('body-progress');
});

/*
ipcRenderer.on("main-cmd-reply",(event, arg)=>{
  console.log(arg);
});

ipcRenderer.send("main-cmd-async", "Hello There");
*/


sshBtn.addEventListener('click', () => {
  fileEx.init(modal);
});

refreshBtn.addEventListener('click', () => {
  fileEx.refresh();
})