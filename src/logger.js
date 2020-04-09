'use strict'

//Logger function
var bunyan = require('bunyan');

var logger = bunyan.createLogger({
    name: 'Cell',
    level: 'debug'
})

module.exports = logger;