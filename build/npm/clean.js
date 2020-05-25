'use strict'

const path = require('path');
const rimraf = require('rimraf');

const dir = ["dist", "out"]

dir.forEach(folder => {
    rimraf(path.join(__dirname, "../..", folder), function () {
        console.log("Deleted folder " + folder);
    })

});