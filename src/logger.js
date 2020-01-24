'use strict'

//Logger function
var bunyan = require('bunyan');

var logger = bunyan.createLogger({
    name: 'Cell'
})

module.exports = logger;