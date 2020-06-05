'use strict';
import { CompositeDisposable } from 'event-kit';
// import * as IPC from './lib/ipc';
import * as path from 'path';
import { autoUpdater, UpdaterSignal } from 'electron-updater';
const logger = require('./logger');
// import {Logger} as logger from './logger;'

//Custom classes
import { CellWindow } from './lib/window';
import { Ssh } from './lib/ssh';

// const {EventEmitter} = require('events');
//settings

let mainWindow: CellWindow | null;

export class CellApplication {
	ssh: Ssh | null;
	disposable: CompositeDisposable;

	constructor() {
		// global.cellApp = this;
		this.ssh = null;
		this.disposable = new CompositeDisposable();
		this.initEventHandle();

		//setup update
		autoUpdater.logger = logger;
		//For prerelease to work
		autoUpdater.allowPrerelease = true;
	}

	createMainWindow(): void {
		logger.info(path.join(__dirname, '../src/index.html'));
		mainWindow = new CellWindow({
			file: path.join(__dirname, '../src/index.html'),
			// file: 'src/forms/form.html'
			// file: 'src/editor/term.html'
		}).on('closed', () => {
			logger.debug('Main window was closed');
			mainWindow = null;
		});
		if (mainWindow) {
			this.update();
			mainWindow.webContents.send('status-change', 'OK');
		}
		this.ssh = new Ssh(mainWindow);

		// xtermTest = new Window({
		//     file: 'src/editor/term.html'
		// })
	}

	quit(callback: () => void): void {
		this.disposable.dispose();
		if (this.ssh) this.ssh.end();
		callback();
	}

	activate(): void {
		if (mainWindow === null) {
			this.createMainWindow();
		}
	}

	update(): void {
		autoUpdater.on('checking-for-update', () => {
			logger.debug('Checking for updates');
			// mainWindow.webContents.send('status-change', 'Update available');
		});
		autoUpdater.on('update-available', () => {
			logger.info('Update available');
			mainWindow.webContents.send('status-change', 'Update available');
		});

		autoUpdater.on('error', (err) => {
			logger.error('AutoUpdater err' + err);
			mainWindow.webContents.send('status-change', 'Update Error');
		});

		autoUpdater.on('update-downloaded', (info) => {
			logger.info('Update available');
			mainWindow.webContents.send('status-change', 'Update Downloaded');
		});

		autoUpdater.checkForUpdatesAndNotify();
	}

	initEventHandle(): void {
		/*Test IPC emitters using HelloThere
            Example call: 
            console.log(IPC.call('HelloThere'));
        */
		// this.disposable.add(
		// 	IPC.on(ipcMain, 'HelloThere', (path) => {
		// 		logger.info('AH! General Kenobi . A bold one ' + path);
		// 	})
		// );
		// this.disposable.add(
		//     IPC.respondTo('modal-interact', () = > {
		//     })
		// );
		// this.disposable.add(
		// 	IPC.on(ipcMain, 'ssh-path-switch', (event, responseChannel) => {
		// 		logger.info('ssh-path-switch');
		// 	})
		// );
		// this.disposable.add(IPC.on(ipcMain, 'loading-cursor', () => {}));
	}
}
