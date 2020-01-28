'use strict'
var Client = require('ssh2').Client;
var logger = require('../logger');

// var conn = new Client();


module.exports = class Ssh {
    constructor() {
        this.username = '';
        var conn = this.conn = new Client();
        this.conn.on('error', function (error) {
            logger.error("SSH fired error " + error);
        })

        // conn.on('ready', function() {
        //     logger.info("SSH Client :: ready");

        // //TODO fix so only keyboard is ever used
        //     // conn.sftp(function(err, sftp) {
        //     //   if (err) throw err;
        //     //   sftp.readdir('$', function(err, list) {
        //     //     if (err) throw err;
        //     //     console.dir(list);
        //     //     conn.end();
        //     //   });
        //     // });
        //   })
    }

    getUserName() {
        return this.username;
    }

    /*
    Public: ends the connection
    */
    close() {
        this.conn.end();
    }

    /*
        Public: connects to a ssh server
        args: config
                Json with username, hostname, and authentication methods
    */

    //Requires modal to be passed in.
    //TODO add incorrect password checking
    logIn(modal) {
        //modal.setSubmitAction
        var config = {
            'tryKeyboard': true,
        }
        var conn = this.conn;
        conn.on('ready', function () {
            logger.info("SSH Client :: ready");
            modal.hide();
        });

        //The functions start with username and call upwards.. Basic call back functions, it was just
        //getting to be a lot

        //******NOTE finish requires a list ******
        conn.on('keyboard-interactive', function (name, instructions, instructionsLang, prompts, finish) {
            logger.info("Keyboard-interactive ssh begin");
            logger.info(prompts);
            //Set enter to do something??
            if(prompts[0].prompt.toLocaleLowerCase().includes('password')){
                finish([config['password']]);
            }

            modal.setSubmitCallback(function(res){
                finish([res]);
            });
            modal.setPlaceholder(prompts[0].prompt);
        });


        var inputPassword = function(password){
            config['password'] = password;
            
            conn.connect(config)
        }

        var inputHostName = function(host){
            config['host'] =host;
            modal.setPlaceholder("connecting");
            logger.info(config);
            modal.setSubmitCallback(inputPassword);
            modal.setPlaceholder("password");
            // modal.setSubmitCallback();
        }

        var inputUsername = function(username){
            config['username'] = username;
            logger.info("inputusername fired");
            modal.setSubmitCallback(inputHostName);
            modal.setPlaceholder("Enter server address...(login.palmetto.clemson.edu)");

        }

        //Get username
        modal.display("Enter username...");
        
        modal.setSubmitCallback(inputUsername)
    }

    connect(config, pass) {
        this.conn.on('keyboard-interactive', function (name, instructions, instructionsLang, prompts, finish) {
            console.log('Connection :: keyboard-interactive');
            console.log(prompts);
            if (prompts[0].prompt.toLocaleLowerCase().includes('password')) {
                finish([pass]);
            } else {
                finish(["1"]);
            }
        });
        console.log(config);
        this.conn.connect(config);
    };
    /*
    public: reads the contents of the path Path 
        Returns a Promise
        args: path
        requires that conn works
    */
    readDir(path) {
        return new Promise((resolve, reject) => {
            this.conn.sftp(function (err, sftp) {
                if (err) reject(err);
                sftp.readdir(path, function (err, list) {
                    if (err) {
                        reject(err);
                    }
                    resolve(list);
                })
            })
        })
    };
}
// conn.on('ready', function () {
//     console.log('Client :: ready');
//     conn.exec('ls ~', function (err, stream) {
//         if (err) throw err;
//         stream.on('close', function (code, signal) {
//             console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
//             conn.end();
//         }).on('data',  function (data) {
//             console.log('STDOUT: ' + data);
//         }).stderr.on('data', function (data) {
//             console.log('STDERR: ' + data);
//         });
//     });
// })






// conn.connect({
//     host: 'access1.computing.clemson.edu',
//     port: 22,
//     username: 'whalabi',
//     password: ''
// });