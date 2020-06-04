'use strict';

import { FileExplorer } from '../lib/fileExplorer';
import { ipcRenderer } from 'electron';
import { Terminal } from 'xterm';
import { stat } from 'fs';

const sshBtn = document.getElementById('sshBtn');
const refreshBtn = document.getElementById('refreshBtn');
const goHereBtn = document.getElementById('goHere');
const termDom = document.getElementById('terminal');
const modal = (document.getElementById('myModal') as ModalElement) || null;

const status = document.getElementById('footer-status');

if (!sshBtn || !refreshBtn || !goHereBtn || !termDom || !modal || !status) {
	throw new Error('One or more DOMs undefined');
} else {
	const fileEx = new FileExplorer();
	// fileEx.on("fileExplorer-loading", () => {
	//   console.log("LOADING");
	//   document.body.classList.add('body-progress');
	// });

	// fileEx.on("fileExplorer-done", () => {
	//   document.body.classList.remove('body-progress');
	// });

	const term = new Terminal();
	term.open(termDom);
	term.onTitleChange(function (title) {
		// document.title = title;
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
		console.log(message);
	});

	function prompt(term: Terminal): void {
		term.write('\r\n$ ');
	}

	term.onData(function (data) {
		ipcRenderer.send('ssh-data-out', data);
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
	});

	goHereBtn.addEventListener('click', () => {
		fileEx.goHere();
		termDom.focus();
	});

	ipcRenderer.on('status-change', (event, text: string) => {
		console.log(text);
		if (status) status.innerText = text;
	});
}
