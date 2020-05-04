'use strict';

//Logger function
const bunyan = require('bunyan');

const logger = bunyan.createLogger({
	name: 'Cell',
	level: 'debug',
});

module.exports = logger;
