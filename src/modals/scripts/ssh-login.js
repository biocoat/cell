const {ipcRenderer} = require('electron')
/*
const {ipcRenderer} = require('electron')

const syncMsgBtn = document.getElementById('sync-msg')

syncMsgBtn.addEventListener('click', () => {
  const reply = ipcRenderer.sendSync('synchronous-message', 'ping')
  const message = `Synchronous message reply: ${reply}`
  document.getElementById('sync-reply').innerHTML = message
})
*/

const submitBtn = document.getElementById('submitSsh');
// const CellGlobal = require("./../../cell-global");
// console.log(CellGlobal.settingsPath);
// const pathBtn = document.getElementById('pathBtn');
// const ssh = CellGlobal.ssh;

// conn.connect({
//     host: 'access1.computing.clemson.edu',
//     port: 22,
//     username: 'whalabi',
//     password: ''
// });
submitBtn.addEventListener('click', (_event) => {
    console.log("Submit clicked")
    const hostnameText = document.getElementById('hostname').value;
    const userNameText = document.getElementById('username').value;
    const passwordText = document.getElementById('password').value;

    var config = {
        'host': hostnameText,
        'port': 22,
        'username': userNameText,
        'password': passwordText
    }
    const reply = ipcRenderer.sendSync('ssh-login',config);
    console.log(reply);
    
    // ssh.connect(config);

});


