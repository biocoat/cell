'use strict'
const {
    Emitter
} = require('event-kit');

module.exports = class FileExplorer {
    constructor(showHidden = false) {
        this.username;
        this.currentDirectory;
        this.showHidden = showHidden;

        this.emitter = new Emitter();

        this.emitter.on('ssh-path-change', () => {
            console.log("I have the high ground")
        })



    }

    run_ls(path){
        console.log(this);
        this.update(path, this.emitter.emit('ssh-path-change', path));
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
            console.log("..")
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

                    fe.run_ls(path + "/" + name);
                });
            }
        })

        div.appendChild(table);
    }




    setUsername(username) {
        this.username = username;
    }

    //Need to be able to log in
    //emit event, and 
    refresh() {
        this.run_ls(this.currentDirectory);
    }




}