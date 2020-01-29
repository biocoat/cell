'use strict'

module.exports = class FileExplorer {
    constructor(showHidden = false) {
        this.username;
        this.currentDirectory;
        this.showHidden = showHidden;

    }

    update(path, dir) {
        console.log(path);
        console.log(dir);

        /*
            Remove hidden
            Signal directories
            Extra: notice file paths
        */
        //    console.log(document.getElementById("fileExplorer"));
        var showHidden = this.showHidden;
        var div = document.getElementById("fileExplorer");
        var table = document.createElement("table");
        dir.forEach(function (item, index){
            var name = item['filename'];
            var isDirectory = item['longname'][0] == 'd';
            if(showHidden == false && item['filename'][0] == '.') return;

            var row = table.insertRow(table.rows.length);
            row.insertCell(0).innerHTML = name;

        })

        div.appendChild(table);
    }

    setUsername(username) {
        this.username = username;
    }


}