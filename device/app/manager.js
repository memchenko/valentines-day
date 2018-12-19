let eventEmitter;

let speakFile;
let tech;
let ftp;

function patrol() {

}

function singAndDance() {}

function speak() {}

function demon() {}

module.exports = (_eventEmitter) => {
    eventEmitter = _eventEmitter;
    speakFile = require('./speakFile')(eventEmitter);
    tech = require('./tech')(eventEmitter);
    ftp = require('./ftp-client')(eventEmitter);
};