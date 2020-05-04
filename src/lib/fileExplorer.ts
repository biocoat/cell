'use strict';

import { EventEmitter } from 'events';
import { ipcRenderer } from 'electron';

// const Ssh = require('../lib/Ssh');

export class FileExplorer extends EventEmitter {
	username: string;
	currentDirectory: string;
	showHidden: boolean;
	constructor(showHidden = false) {
		super();

		this.username = '';
		this.currentDirectory = '';
		this.showHidden = showHidden;

		ipcRenderer.on('ssh', (event, args: string) => {
			if (args === 'OK') {
				console.log('Hello?');
				this.ls('/home/' + this.username);
			} else {
				console.error('SSH FAILED ' + args);
			}
		});

		// this.emitter = new Emitter();

		// this.emitter.on('ssh-path-change', () => {
		//     console.log("I have the high ground")
		// })

		// this.ssh = new Ssh();
	}

	//Get director for path:String
	ls(path: string): void {
		// var fe = this;
		console.log(path);
		// this.emit("fileExplorer-loading");
		ipcRenderer.on('fe-dir', (event, res, error) => {
			if (error) {
				console.log('SFTP threw error ' + error);
				return;
			}
			this.update(res['path'], res['dir']);
		});
		ipcRenderer.send('ssh-read-dir', path);

		// this.ssh.readDir(path).then((res) => {
		//     // fe.setUsername(res['username']);
		//     fe.update(res["path"], res["dir"]);

		// }).catch((error) => {
		//     console.log(error);
		// })
	}

	update(path: string, dirList: any): void {
		this.currentDirectory = path;
		console.log(path);
		console.log(dirList);
		const id = 'dirtableid';

		//Clear the old table
		let oldE = document.getElementById(id);
		if (oldE !== null) {
			if (oldE.parentNode !== null) {
				oldE.parentNode.removeChild(oldE);
				oldE = null;
			} else {
				console.error('removing old file from FE failed');
			}
		}

		//    console.log(document.getElementById("fileExplorer"));

		const div = document.getElementById('fileExplorer');
		if (div === null) {
			console.error('file explorer does not exist');
			return;
		}
		// var run_ls = this.run_ls;

		const table = document.createElement('table');
		table.setAttribute('id', id);

		//Add parent directory shortcut
		const parentRow = table.insertRow(0);
		parentRow.setAttribute('class', 'fs-element dir');
		parentRow.addEventListener('click', () => {
			if (path === '/') return;
			this.ls(path.substring(0, path.lastIndexOf('/')));
		});
		parentRow.innerHTML = '..';

		// eslint-disable-next-line prefer-const
		for (let item of dirList) {
			const name = item['filename'];
			const isDirectory = item['longname'][0] == 'd';

			if (this.showHidden == false && item['filename'][0] == '.') return;

			const row = table.insertRow(table.rows.length);
			row.setAttribute('class', 'fs-element');
			row.insertCell(0).innerHTML = name;
			if (isDirectory) {
				row.setAttribute('class', 'fs-element dir');
				row.addEventListener('click', () => {
					console.log(name);
					row.cells[0].innerHTML = '<i class="fa fa-spinner fa-spin">' + name + '</i>';
					this.ls(path + '/' + name);
				});
			}
		}

		div.appendChild(table);
		this.emit('fileExplorer-done');
	}

	setUsername(username: string): void {
		this.username = username;
	}

	//Need to be able to log in
	refresh(): void {
		if (this.currentDirectory == undefined) {
			this.currentDirectory = '/home/';
		}
		this.ls(this.currentDirectory);
	}

	init(modal: ModalElement): void {
		// modal.setPlacholder()
		const config = {
			username: '',
			host: '',
		};
		modal.display('Enter Username');
		modal.setSubmitCallback((username: string) => {
			config['username'] = username;
			this.username = username;
			modal.setPlaceholder('Enter server address...');
			modal.setSubmitCallback(function (host) {
				config['host'] = host;
				modal.setPlaceholder('password');
				modal.setSubmitCallback(function (pass) {
					// config['password'] = pass;
					modal.setSubmitCallback(function (ans) {
						ipcRenderer.send('modal-input', ans);
					});
					ipcRenderer.on('modal-display', (event, message) => {
						modal.setPlaceholder(message);
					});
					ipcRenderer.invoke('ssh-login', config, pass).then((res) => {
						//wait for a send
					});
				});
			});
		});
	}

	goHere(): void {
		ipcRenderer.send('ssh-data-out', 'cd ' + this.currentDirectory);
	}
}
