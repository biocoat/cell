// 'use strict';

// //Wajdi Halabi
// //Menu class

// // const { Menu, MenuItem } = require('electron');
// import { Menu, MenuItem } from 'electron';

// const template = [
// 	{
// 		label: 'File',
// 		submenu: [
// 			{
// 				label: 'Open Modal',
// 				accelerator: 'CmdOrCtrl+Shift+P',
// 				click: () => {
// 					global.modal.display('Hello There?');
// 				},
// 			},
// 		],
// 	},
// 	{
// 		label: 'Edit',
// 		submenu: [
// 			{
// 				role: 'undo',
// 			},
// 			{
// 				role: 'redo',
// 			},
// 			{
// 				type: 'separator',
// 			},
// 			{
// 				role: 'cut',
// 			},
// 			{
// 				role: 'copy',
// 			},
// 			{
// 				role: 'paste',
// 			},
// 		],
// 	},

// 	{
// 		label: 'View',
// 		submenu: [
// 			{
// 				role: 'reload',
// 			},
// 			{
// 				role: 'toggledevtools',
// 			},
// 			{
// 				type: 'separator',
// 			},
// 			{
// 				role: 'resetzoom',
// 			},
// 			{
// 				role: 'zoomin',
// 			},
// 			{
// 				role: 'zoomout',
// 			},
// 			{
// 				type: 'separator',
// 			},
// 			{
// 				role: 'togglefullscreen',
// 			},
// 		],
// 	},

// 	{
// 		role: 'window',
// 		submenu: [
// 			{
// 				role: 'minimize',
// 			},
// 			{
// 				role: 'close',
// 			},
// 		],
// 	},

// 	{
// 		role: 'help',
// 		submenu: [
// 			{
// 				label: 'Learn More',
// 			},
// 			{
// 				label: 'About',
// 			},
// 		],
// 	},
// ] : ;

// module.exports = class CellMenu {
// 	constructor() {}

// 	initMenu() {
// 		const menu = Menu.buildFromTemplate(template);
// 		Menu.setApplicationMenu(menu);
// 	}
// };
