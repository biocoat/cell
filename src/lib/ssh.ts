'use strict';

import { Client } from 'ssh2';
const logger = require('../logger');

// In main process.
import { ipcMain } from 'electron';
import { CellWindow } from './window';
// ipcMain.on('asynchronous-message', (event, arg) => {
//     console.log(arg) // prints "ping"
//     event.reply('asynchronous-reply', 'pong')
// })

// ipcMain.on('synchronous-message', (event, arg) => {
//     console.log(arg) // prints "ping"
//     event.returnValue = 'pong'
// })

// ipcMain.handle('some-name', async (event, someArgument) => {
//     const result = await doSomeWork(someArgument)
//     return result
// })

//Helper function for SFTP return
const sortDir = function (a: any, b: any): number {
	const nameA = a.filename.toUpperCase();
	const nameB = b.filename.toUpperCase();
	let comp = 0;
	if (nameA > nameB) comp = 1;
	else if (nameA < nameB) comp = -1;
	return comp;
};

/*FIXME Uncaught exception STREAM_WRITE_AFTER_END
CAUSE: killing the ssh session and the logging back in 
*/

/*
Notes
Use .once event listeners inside callbacks in ssh2.
Otherwise there is bounce and ssh2 hangs 
*/

export class Ssh {
	status: string;
	username: string;
	conn: Client;
	constructor(win: CellWindow) {
		this.conn = new Client();
		this.status = 'NONE';
		this.username = '';

		const username = this.username;
		this.conn.on('ready', () => {
			console.log('SSH::READY');
			this.status = 'OK';
			this.conn.shell((err, stream) => {
				if (err) throw err;
				win.webContents.send('ssh', 'OK');
				stream
					.on('close', () => {
						console.log('Stream :: close');
						this.conn.end();
					})
					.on('data', (data: any) => {
						//   console.log('OUTPUT: ' + data);
						win.webContents.send('ssh-data-in', data);
					});
				ipcMain.on('ssh-data-out', (event, arg) => {
					stream.write(arg);
				});
			});

			this.conn.sftp(function (err, sftp) {
				if (err) {
					logger.info('SSH:: SFTP FAILED ' + String(err));
					win.webContents.send('ssh', 'SFTP FAILED');
					return;
				}
				console.log('SFTP created');
				ipcMain.on('ssh-read-dir', (event, path) => {
					logger.debug(path);
					sftp.readdir(path, function (err, list) {
						if (err) {
							event.reply('fe-dir', 'error', err);
							return;
						}

						list.sort(sortDir);
						event.reply('fe-dir', {
							path: path,
							username: username,
							dir: list,
						});
					});
				});
			});
		});
		//******NOTE finish requires a list ******
		this.conn.on('keyboard-interactive', function (name, instructions, instructionsLang, prompts, finish) {
			logger.info('Keyboard-interactive ssh begin');
			logger.info(prompts);
			// if (prompts[0].prompt.toLocaleLowerCase().includes('password')) {
			// } else {
			//     finish(["1"])
			// }

			//Send the text to the modal
			//NOTE Listen once, this stops bounce??
			//Unsure why it works, but only using once and having listener
			//reinit every time works.
			win.webContents.send('modal-display', prompts[0].prompt);
			ipcMain.once('modal-input', (event, arg) => {
				logger.info(arg);
				logger.info(typeof arg);
				finish([arg]);
			});
			// if(prompts[0].prompt.toLocaleLowerCase().includes('password')) {
			//     // finish(["password"])
			// } else {
			//     finish(["1"])
			// };

			// modal.setSubmitCallback(function (res) {
			//     finish([res]);
			// });
			// modal.setPlaceholder(prompts[0].prompt);
		});

		ipcMain.handle('ssh-login', async (event, config) => {
			this.username = config['username'];
			config['tryKeyboard'] = true;
			// config['keepaliveInterval'] = 1000;
			// config['readyTimeout'] = 99999999;
			// config['debug'] = (info: string): void => {logger.info(info);};

			//Keyboard interactive must be tried before password. the invalid password attempts force Palmetto
			//to close the session after authentication
			//See https://github.com/mscdex/ssh2/issues/895 for more details
			let authPos = 0;
			//
			const authsAllowed = ['none', 'keyboard-interactive', 'password']; //'publickey', 'agent', 'hostbased']; //Full list, but not used yet
			config['authHandler'] = function authHandler(authsLeft: any, partial: any, cb: any): boolean | string {
				if (authPos === authsAllowed.length) return false;
				return authsAllowed[authPos++];
			};
			console.log(config);
			this.conn.connect(config);
			// var ret = await this.conn.connect(config);

			//return result;
		});
	}

	end(): void {
		this.conn.end();
	}
}
