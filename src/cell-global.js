/* 
    Wajdi Halabi
    10/21/2019
    A singleton master class to hold the application state
    
*/

//Add require statements
const Ssh = require("./lib/ssh");

//Class export as moudle
//constructor add 

class CellGlobal {
    constructor() {
        if (!CellGlobal.instance) {
            this.settingsPath = '/path/to/settings';
            this.views = 'the view class';
            this.ssh = new Ssh();
            CellGlobal.instance = this;
        }
        return CellGlobal.instance;
    }

    close(){
        this.ssh.close();
    }
}
const instance = new CellGlobal();
Object.freeze(instance)
module.exports = instance;