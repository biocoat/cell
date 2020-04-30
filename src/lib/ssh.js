'use strict'

var Client = require('ssh2').Client;
var logger = require('../logger');

// In main process.
const {
    ipcMain
} = require('electron')
// ipcMain.on('asynchronous-message', (event, arg) => {
//     console.log(arg) // prints "ping"
//     event.reply('asynchronous-reply', 'pong')
// })

// ipcMain.on('synchronous-message', (event, arg) => {
//     console.log(arg) // prints "ping"
//     event.returnValue = 'pong'
// })

// ipcMain.handle('some-name', async (event, someArgument) => {
//     const result = await doSomeWork(someArgument)
//     return result
// })

//Helper function for SFTP return
var sortDir = function (a, b) {
    const nameA = a.filename.toUpperCase();
    const nameB = b.filename.toUpperCase();
    let comp = 0;
    if (nameA > nameB) comp = 1;
    else if (nameA < nameB) comp = -1;
    return comp;
};

module.exports = class Ssh {
    constructor(win) {
        var conn = this.conn = new Client();
        var status = "NONE";
        var username = this.username = '';

        // conn.connect({
        //     host: 'access1.computing.clemson.edu',
        //     port: 22,
        //     username: 'whalabi',
        //     password: ''
        //     // privateKey: require('fs').readFileSync('/here/is/my/key')
        // });

        conn.on('ready', function () {
            console.log("SSH::READY");
            status = "OK"
            conn.shell(function (err, stream) {
                if (err) throw err;
               win.webContents.send('ssh', "OK");
                stream.on('close', function () {
                    console.log('Stream :: close');
                    conn.end();
                }).on('data', function (data) {
                    //   console.log('OUTPUT: ' + data);
                    win.webContents.send('ssh-data-in', data);

                });
                ipcMain.on('ssh-data-out', (event, arg) => {
                    stream.write(arg);
                });
            });

            conn.sftp(function (err, sftp) {
                if (err) {
                    logger.info("SSH:: SFTP FAILED " + String(err));
                    event.reply('fe-dir', 'error', err);
                    return;
                }
                console.log("SFTP created");
                ipcMain.on("ssh-read-dir", (event, path)=> {
                    logger.debug(path);
                    sftp.readdir(path, function(err,list){
                        if(err){
                            event.reply('fe-dir', 'error', err);                            return;
                            return;
                        }
                        list.sort(sortDir);
                        event.reply('fe-dir', {
                            "path": path,
                            "username" : username,
                            "dir" : list
                        });

                    })
                })
            });
        });

        //******NOTE finish requires a list ******
        conn.on('keyboard-interactive', function (name, instructions, instructionsLang, prompts, finish) {
            logger.info("Keyboard-interactive ssh begin");
            logger.info(prompts);
            // if (prompts[0].prompt.toLocaleLowerCase().includes('password')) {
            // } else {
            //     finish(["1"])
            // }
            
            //Send the text to the modal
            //Listen once, this stops bounce??
            //Unsure why it works, but only using once and having listner
            //reinit every time works.
            win.webContents.send('modal-display', prompts[0].prompt);
            ipcMain.once('modal-input', (_, arg) => {
                logger.info(arg)
                logger.info(typeof(arg));
                finish([arg]);
            });
            // if(prompts[0].prompt.toLocaleLowerCase().includes('password')) {
            //     // finish(["password"])
            // } else {
            //     finish(["1"])
            // };
            
            // modal.setSubmitCallback(function (res) {
            //     finish([res]);
            // });
            // modal.setPlaceholder(prompts[0].prompt);
        });

        ipcMain.handle('ssh-login', async (event, config) => {
            username = config['username'];
            config['tryKeyboard'] = true;
            config['keepaliveInterval'] = 1000;
            config['readyTimeout'] = 99999999;
            config['debug'] = console.log();
            console.log(config);
            var ret = await conn.connect(config);
            

            //return restult;
        });


    }
    
    end(){
        this.conn.end();
    }

}