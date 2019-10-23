const CellGlobal = require("./../../cell-global");
console.log(CellGlobal.settingsPath);
const submitBtn = document.getElementById('submitSsh');
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
    const userNameText = document.getElementById('username').value;
    const hostnameText = document.getElementById('hostname').value;
    const passwordText = document.getElementById('password').value;

    var config = {
        'host': hostnameText,
        'port': 22,
        'username': userNameText,
        'password': passwordText
    }
    ssh.connect(config);

});


