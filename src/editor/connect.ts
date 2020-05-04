const Ssh = require('../lib/Ssh');

const submitBtn = document.getElementById('submitSsh');
const pathBtn = document.getElementById('pathBtn');
const ssh = new Ssh();

submitBtn.addEventListener('click', () => {
	console.log('Submit clicked');
	const userNameText = document.getElementById('username').value;
	const hostnameText = document.getElementById('hostname').value;
	const passwordText = document.getElementById('password').value;

	var config = {
		host: hostnameText,
		port: 22,
		username: userNameText,
	};
	ssh.connect(config, passwordText);
});

pathBtn.addEventListener('click', () => {
	console.log('path clicked');
	const pathtext = document.getElementById('pathText').value;
	ssh
		.readDir(pathtext)
		.then((dir) => {
			console.log(dir);
			var table = document.getElementById('table-body');
			dir.forEach(function (item, index) {
				console.log(item);
				var name = item['filename'];
				var isDirectory = '?';
				if (item['longname'][0] == 'd') {
					isDirectory = 'Yes';
				} else {
					isDirectory = 'No';
				}
				var rowCount = table.rows.length;
				var row = table.insertRow(rowCount);

				row.insertCell(0).innerHTML = index;
				row.insertCell(1).innerHTML = name;
				row.insertCell(2).innerHTML = isDirectory;

				// var newElement = '<tr><th scope="row">${index}</th><td>${name}</td><td>${isDirectory}</td></tr>'
				// table.appendChild(newElement);
			});
		})
		.catch((error) => {
			console.log('the promsie was rejected');
			console.log(error);
		});
});
