'use strict'

const FileExplorer = require('../lib/fileExplorer')

const fileEx = new FileExplorer()
const sshBtn = document.getElementById('sshBtn');
const refreshBtn = document.getElementById('refreshBtn');
const goHereBtn = document.getElementById('goHere');
const termDom = document.getElementById('terminal')

var modal = document.getElementById('myModal');
const { ipcRenderer } = require('electron')


// fileEx.on("fileExplorer-loading", () => {
//   console.log("LOADING");
//   document.body.classList.add('body-progress');
// });

// fileEx.on("fileExplorer-done", () => {
//   document.body.classList.remove('body-progress');
// });

var term = new Terminal();
term.open(termDom);
// term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ');
term.onTitleChange(function (title) {
  // document.title = title
});

// term.onKey(e => {
//   console.log(typeof(e))
  // ipcRenderer.send('ssh-data-out', e);
//   // const printable = !e.domEvent.altKey && !e.domEvent.altGraphKey && !e.domEvent.ctrlKey && !e.domEvent.metaKey;

//   // if (e.domEvent.keyCode === 13) {
//   //   prompt(term);
//   // } else if (e.domEvent.keyCode === 8) {
//   //   // Do not delete the prompt
//   //   if (term._core.buffer.x > 2) {
//   //     term.write('\b \b');
//   //   }
//   // } else if (printable) {
//   //   term.write(e.key);
//   // }
// });

ipcRenderer.on('ssh-data-in', (event, message) => {
  term.write(message);
  console.log(message) // Prints 'whoooooooh!'
})


function prompt(term) {
  term.write('\r\n$ ');
}

term.onData(function (data) {
  ipcRenderer.send('ssh-data-out', data);

})

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

goHereBtn.addEventListener('click', () => {
  fileEx.goHere();
  termDom.focus()
})



