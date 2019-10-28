var Client = require('ssh2').Client;

module.exports = class Ssh {
   constructor() {
      this.username = '';
      this.conn = new Client()
   }

   getUserName() {
      return this.username;
   }

   close() {
      this.conn.end();
   }

   /*
       Public: connects to a ssh server
       args: config
               Json with username, hostname, and authentication methods
   */
   connect(config) {
      console.log(config);
      this.username = config.username;
      return new Promise((resolve, reject) => {
         try{
            this.conn.connect(config);
            resolve({"sucess":1});
         }
         catch(e){
            console.log(e);
            reject({"success":0, "error":e});
         }
         
      })
      // console.log(config);
   }
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
   }
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
