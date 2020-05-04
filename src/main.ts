import { app } from 'electron';

// const CellMenu = require('./menu');
// const CellApplication = require('./cellApplication');
import { CellApplication } from './cellApplication';
const logger = module.exports.logger;

//global instance to prevent garbage collections
let cellApp: CellApplication;

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
	cellApp = new CellApplication();

	// const cellMenu = new CellMenu();
	// cellMenu.initMenu();

	cellApp.createMainWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	// eslint-disable-next-line no-undef
	if (process.platform !== 'darwin') {
		cellApp.quit(() => app.quit());
	}
});

// On OS X it's common to re-create a window in the app when the
// dock icon is clicked and there are no other windows open.
app.on('activate', function () {
	cellApp.activate();
});
