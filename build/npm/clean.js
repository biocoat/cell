'use strict'

const path = require('path');
const rimraf = require('rimraf');
const fs = require('fs');

const dir = ["dist", "out"]

dir.forEach(folder => {
    rimraf(path.join(__dirname, "../..", folder), function () {
        console.log("Deleted folder " + folder);
    })

});

//Delete incremental build file
fs.unlink(path.join(__dirname, "../..", "tsconfig.tsbuildinfo"), (err) => {
    console.log("tsconfig.tsbuildinfo deleted")
});