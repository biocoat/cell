'use strict'
var Client = require('ssh2').Client;
var logger = require('../logger');
const {
    CompositeDisposable,
    Emitter
} = require('event-kit');
const IPC = require("./ipc");

// var conn = new Client();

//Ssh needs to move to main. Work via IPC
//Why?: Becuse right now, SSH obj only exists in this window

module.exports = class Ssh {
    constructor() {
        this.username = '';
        var conn = this.conn = new Client();
        this.status = "NONE";
        this.conn.on('error', function (error) {
            logger.error("SSH fired error " + error);
        })

        this.emitter = new Emitter();

        this.emitter.on('ssh-path-change', (event, path) => {
            logger.info("ssh-path-change rec")
            this.readDir(path).then((res) => {
                event.sender.send('ssh-path-OK', res);
            });
        })

        this.sftp = null;


        // const pathChangeSub = this.onPathChange((path) => {
        //     this.readDir(path).then((res)=>{

        //     });
        // })


        //initialize change path listener

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
    logIn(modal, callback) {
        //modal.setSubmitAction
        var config = {
            'tryKeyboard': true,
            'username': ''
            // 'debug' : console.log
        }
        var password = "";
        var ssh = this;
        var conn = this.conn;
        conn.on('ready', function () {
            if (ssh.status == "READY") return; //catch multiple ready signals
            ssh.status = "READY"
            logger.info("SSH Client :: ready");

            conn.sftp(function (err, sftp) {
                if (err) {
                    logger.info("SSH:: SFTP FAILED " + String(err));
                    return;
                }
                console.log("SFTP created");
                ssh.sftp = sftp;
                modal.hide();
                callback(null, ssh.username);
            })



        });

        //The functions start with username and call upwards.. Basic call back functions, it was just
        //getting to be a lot

        //******NOTE finish requires a list ******
        conn.on('keyboard-interactive', function (name, instructions, instructionsLang, prompts, finish) {
            logger.info("Keyboard-interactive ssh begin");
            logger.info(prompts);
            //Set enter to do something??
            if (prompts[0].prompt.toLocaleLowerCase().includes('password')) {
                finish([password]);
            }

            modal.setSubmitCallback(function (res) {
                finish([res]);
            });
            modal.setPlaceholder(prompts[0].prompt);
        });


        var inputPassword = function (pass) {
            config['password'] = pass;

            conn.connect(config)
        }

        var inputHostName = function (host) {
            config['host'] = host;
            modal.setPlaceholder("connecting");
            logger.info(config);
            modal.setSubmitCallback(inputPassword);
            modal.setPlaceholder("password");
            // modal.setSubmitCallback();
        }

        var inputUsername = function (username) {
            config['username'] = username;
            ssh.username = username;
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
        //helper function that sorts the directory list into alphabetical 
        var sortDir = function (a, b) {
            const nameA = a.filename.toUpperCase();
            const nameB = b.filename.toUpperCase();
            let comp = 0;
            if (nameA > nameB) comp = 1;
            else if (nameA < nameB) comp = -1;
            return comp;
        };

        var user = this.username;
        var sftp = this.sftp;
        // path =  path.replace("~", "/home/" + user);

        return new Promise((resolve, reject) => {
            if (sftp) {
                console.log(path);
                sftp.readdir(path, function (err, list) {
                    if (err) {
                        reject(err);
                    }
                    list.sort(sortDir);

                    resolve({
                        "path": path,
                        "username": user,
                        "dir": list
                    });
                })

            } else {
                reject("SFTP does not exist");
            }
        })
    };

}