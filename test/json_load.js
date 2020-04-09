'use strict'

const loadJson = require('load-json-file');

var JSONDIR = "json/pbs.json"

var load = loadJson.sync(JSONDIR)

load['qsub']["_option_types"].forEach(element => {
    console.log(element);
});