'use strict'
const {
    Emitter
} = require('event-kit');
const EventEmitter = require('events');
const Ssh = require('../lib/Ssh');
const IPC = require('../lib/ipc');

module.exports = class FileExplorer extends EventEmitter {
    constructor(showHidden = false) {
        super();
        
        this.username;
        this.currentDirectory;
        this.showHidden = showHidden;

        // this.emitter = new Emitter();

        // this.emitter.on('ssh-path-change', () => {
        //     console.log("I have the high ground")
        // })

        this.ssh = new Ssh();



    }

    run_ls(path){
        var fe = this;
        console.log(path);
        this.emit("fileExplorer-loading");
        this.ssh.readDir(path).then((res)=>{
            // fe.setUsername(res['username']);
            fe.update(res["path"], res["dir"]);

        }).catch((error) => {
            console.log(error);
        })

        // console.log(this);
        // this.update(path, this.emitter.emit('ssh-path-change', path));
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
            if(path === "/") return;
            
            fe.run_ls(path.substring(0,path.lastIndexOf("/")));
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
    //emit event, and 
    refresh() {
        this.run_ls(this.currentDirectory);
    }

    
    init(modal){
        var fe = this;
        fe.ssh.logIn(modal, function(error, username){
            if(error){
                console.log("SSH error " + error);
                return;

            }
            fe.username = username;
            fe.run_ls("/home/" + username);
            
        });

    }




}