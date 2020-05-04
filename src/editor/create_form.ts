const loadJson = require('load-json-file');
// import loadJson = require('load-json-file');
const { ipcRenderer } = require('electron');

const path = require('path');

// import forms from 'forms';
const forms = require('forms');

const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

let data = {};
// var JSONDIR = "json/pbs.json"

// var load = loadJson.sync(JSONDIR)

// load['qsub']["_option_types"].forEach(element => {
//     logger.debug(element);
// });
let regForm: string;

const createForm = function (scheme = 'qsub', server = 'palmetto'): void {
	// var json_path = path.resolve( __dirname + "../.."+ "json", name + ".json");
	// var json_path = "json/pbs.json";
	var json_path = 'json/pbs.json';

	var doc = document.getElementById('form');

	data = loadJson.sync(json_path)[scheme];
	console.log(data);
	var child;
	var option;
	var formData = {};
	for (var i = 0; i < data['options'].length; i++) {
		option = data['options'][i];
		// logger.debug(option['input']);
		console.debug(option['input']);
		var inputType = option['input'];
		if (inputType == 'date') {
			console.debug('date found');
		} else if (inputType == 'file') {
			console.debug('file found');
		} else if (inputType == 'boolean') {
			formData[option['flag']] = fields.boolean({
				label: option['name'],
			});
			// child = document.createElement('div');
			// doc.appendChild(child);
			// child.innerHTML = `<label class="checkbox"><input type="checkbox" name=${e['flag']}>${e['name']}</label>`;
			console.debug('boolean found');
		} else if (inputType == 'list') {
			console.debug('list is found');
		} else if (inputType == 'external') {
			console.debug('external found');
		} else if (inputType == 'combination') {
			var combinations = {};
			for (var com in option['format']) {
				// console.log(option['format'][com]);
				combinations[option['format'][com]['flag']] = option['format'][com]['name'];
			}
			// console.log(combinations)

			formData[option['flag']] = fields.array({
				label: option['name'],
				choices: combinations,
				widget: widgets.multipleCheckbox({
					label: option['name'],
				}),
			});

			// logger.debug("combination found");
			// child = document.createElement('div');
			// doc.appendChild(child);
			// child.innerHTML = `${e['name']}<br><label class="checkbox">`
			// //The items are added async, so it's added after the final text
			// e['format'].forEach(item => {
			//     child.innerHTML += `<input type="checkbox" name="${e['name']}">${item['name']}<br>`
			// })
			// // child.innerHTML += '</label>';
		} else if (inputType == 'custom list') {
			console.debug('custom list found');
		} else if (inputType == 'string') {
			formData[option['flag']] = fields.string({
				label: option['name'],
			});
			// child = document.createElement('div');
			// doc.appendChild(child);
			// child.innerHTML = `${e['name']}: <input class="input" type="text" name="${e['flag']}"placeholder="${e['default']}">`;
			console.debug('string found');
		} else {
			console.warn('ERROR');
		}
	}

	regForm = forms.create(formData);

	// doc.insertAdjacentHTML('beforebegin', reg_form.toHTML())
	doc.innerHTML += regForm.toHTML();
};

createForm();

// document.getElementById('form').addEventListener('submit', function(event){
//     event.preventDefault();
//     console.log("submit")
//     console.log(this)
// })

function myView(req, res) {
	console.log(req);
	regForm.handle(req, {
		success: function (form) {
			console.log(form.data);
			// there is a request and the form is valid
			// form.data contains the submitted data
		},
		error: function (form) {
			// the data in the request didn't validate,
			// calling form.toHTML() again will render the error messages
		},
		empty: function (form) {
			// there was no form data in the request
		},
	});
}
var formDOM = document.getElementById('form');
formDOM.onsubmit = submit;

function submit(event) {
	event.preventDefault();
	// console.log(event);

	var recPack = new FormData(formDOM);
	var res = {};
	// console.log(rePac);

	//Unpack entries into object
	for (var [key, value] of recPack.entries()) {
		// console.log(key, value);
		if (key in res) {
			res[key] = res[key] + value;
		} else {
			res[key] = value;
		}
	}
	var option;
	var out = 'qsub ';
	for (var i = 0; i < data['options'].length; i++) {
		option = data['options'][i];
		var flag = option['flag'];
		if (flag in res) {
			//Found a flag
			console.log(flag);
			var inputType = option['input'];
			console.log(inputType);
			if (inputType == 'date') {
				console.log('date found');
				out += flag + ' ' + res[flag] + ' ';
			} else if (inputType == 'file') {
				console.log('file found');
				out += flag + ' ' + res[flag] + ' ';
			} else if (inputType == 'boolean') {
				console.log('boolean found');
				out += flag + ' ';
			} else if (inputType == 'list') {
				console.log('list is found');
			} else if (inputType == 'external') {
				console.log('external found');
			} else if (inputType == 'combination') {
				out += flag + ' ' + res[flag] + ' ';
				console.log('combination found');
			} else if (inputType == 'custom list') {
				console.log('custom list found');
			} else if (inputType == 'string') {
				console.log('string found');
				if (res[flag] != '') {
					// console.log("Hello?")
					out += flag + ' ' + res[flag] + ' ';
				}
			} else {
				console.log('ERROR');
			}
		}
		// option = data['options'][i];
		// logger.debug(option['input']);
	}

	ipcRenderer.send('ssh-data-out', out);
}
