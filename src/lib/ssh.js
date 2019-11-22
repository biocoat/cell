'use strict'
var Client = require('ssh2').Client;

// var conn = new Client();

// conn.on('ready', function () {
//     console.log('Client :: ready');
//     conn.sftp(function (err, sftp) {
//         if (err) throw err;
//         sftp.readdir('/home/whalabi/212', function (err, list) {
//             if (err) throw err;
//             console.dir(list);
//             conn.end();
//         });
//     });
// })

module.exports = class Ssh {
    constructor() {
        this.username = '';
        var conn = this.conn = new Client();
        this.conn.on('error', function(error){
            console.log(error);
        })

        conn.on('ready', function() {
            console.log('Client :: ready');
            // conn.sftp(function(err, sftp) {
            //   if (err) throw err;
            //   sftp.readdir('$', function(err, list) {
            //     if (err) throw err;
            //     console.dir(list);
            //     conn.end();
            //   });
            // });
          })


        // this.conn

    }

    /*
        Public: return this.username
        args: None
        returns string
    */
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
    connect(config,pass) {
        config['tryKeyboard'] = true;

        this.username = config.username;

        this.conn.on('keyboard-interactive', function(name, instructions, instructionsLang, prompts, finish){
            console.log('Connection :: keyboard-interactive');
            console.log(prompts);
            if(prompts[0].prompt.toLocaleLowerCase().includes('password')){
                finish([pass]);
            }else{
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
                    if (err) {reject(err);}
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