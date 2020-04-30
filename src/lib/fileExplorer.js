'use strict'

const EventEmitter = require('events');
// const Ssh = require('../lib/Ssh');
const {
    ipcRenderer
} = require('electron')
module.exports = class FileExplorer extends EventEmitter {
    constructor(showHidden = false) {
        super();

        this.username;
        this.currentDirectory;
        this.showHidden = showHidden;

        ipcRenderer.on('ssh', (event, args) => {
            if(args == "OK"){
                console.log("Hello?")
                this.run_ls("/home/" + this.username);
            }
        })

        // this.emitter = new Emitter();

        // this.emitter.on('ssh-path-change', () => {
        //     console.log("I have the high ground")
        // })

        // this.ssh = new Ssh();



    }

    run_ls(path) {
        var fe = this;
        console.log(path);
        // this.emit("fileExplorer-loading");
        ipcRenderer.on('fe-dir', (event, res,error) => {
            if(error){
                console.log("SFTP threw error " + error);
                return;
            }
            fe.update(res["path"], res["dir"]);
        })
        ipcRenderer.send('ssh-read-dir', path);

        // this.ssh.readDir(path).then((res) => {
        //     // fe.setUsername(res['username']);
        //     fe.update(res["path"], res["dir"]);

        // }).catch((error) => {
        //     console.log(error);
        // })

    }

    update(path, dirList) {
        this.currentDirectory = path;
        console.log(path);
        console.log(dirList);
        const id = "dirtableid";

        //Clear the old table
        var oldE = document.getElementById(id);
        if (oldE != null) {
            oldE.parentNode.removeChild(oldE);
            oldE = null;
        }

        //    console.log(document.getElementById("fileExplorer"));
        var showHidden = this.showHidden;
        var div = document.getElementById("fileExplorer");
        // var run_ls = this.run_ls;

        var table = document.createElement("table");
        table.setAttribute("id", id)

        //Add parent directory shortcut
        var parentRow = table.insertRow(0)
        parentRow.setAttribute('class', 'fs-element dir')
        parentRow.addEventListener('click', () => {
            if (path === "/") return;

            fe.run_ls(path.substring(0, path.lastIndexOf("/")));
        })
        parentRow.innerHTML = "..";

        var fe = this;
        dirList.forEach(function (item) {
            var name = item['filename'];
            var isDirectory = (item['longname'][0] == 'd');

            if (showHidden == false && item['filename'][0] == '.') return;

            var row = table.insertRow(table.rows.length);
            row.setAttribute('class', 'fs-element');
            row.insertCell(0).innerHTML = name;
            if (isDirectory) {
                row.setAttribute('class', 'fs-element dir');
                row.addEventListener('click', () => {
                    console.log(name);
                    row.cells[0].innerHTML = '<i class="fa fa-spinner fa-spin">' + name + '</i>';
                    fe.run_ls(path + "/" + name);
                });
            }
        })

        div.appendChild(table);
        this.emit("fileExplorer-done");

    }

    setUsername(username) {
        this.username = username;
    }

    //Need to be able to log in
    refresh() {
        if(this.currentDirectory == undefined){
            this.currentDirectory = '/home/';
        }
        this.run_ls(this.currentDirectory);
    }

    init(modal) {
        var fe = this;
        // modal.setPlacholder()
        var config = {};
        modal.display("Enter Username");
        modal.setSubmitCallback(function (username) {
            config['username'] = username;
            fe.username = username;
            modal.setPlaceholder("Enter server address...");
            modal.setSubmitCallback(function (host) {
                config['host'] = host;
                modal.setPlaceholder("password");
                modal.setSubmitCallback(function (pass) {
                    // config['password'] = pass;
                    modal.setSubmitCallback(function (ans) {
                        ipcRenderer.send('modal-input', ans);
                    })
                    ipcRenderer.on('modal-display', (event, message) => {
                        modal.setPlaceholder(message);

                    })
                    ipcRenderer.invoke('ssh-login', config, pass).then((res) => {
                        //wait for a send
                    })
                })
            })
        })
        // fe.ssh.logIn(modal, function(error, username){
        //     if(error){
        //         console.log("SSH error " + error);
        //         return;
        //     }
        //     fe.username = username;
        //     fe.run_ls("/home/" + username);

        // });

    }    
    goHere(){
        ipcRenderer.send('ssh-data-out', "cd " + this.currentDirectory);
    }
}