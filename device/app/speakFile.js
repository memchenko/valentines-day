const fs = require('fs');
const path = require('path');

const Speaker = require('speaker');
const wav = require('wav');

const FILES_DIR = require('../../constants/constants.js').DEVICE_FILES_DIR;

let eventEmitter;

let queue = [];

function addToQueue(filename) {
	queue.push(() => {
		playFile(filename);
	});

	if (queue.length === 1) queue[0]();
}

function playFile(filename) {
	// console.log('...playing file: ', filename);

	const file = fs.createReadStream(path.resolve(FILES_DIR, filename));
	const reader = new wav.Reader();

	// the "format" event gets emitted at the end of the WAVE header 
	reader.on('format', function (format) {

		const speaker = new Speaker(format);

		speaker.on('unpipe', () => {
			console.log('Finished: ', filename);
			setTimeout(() => {
				eventEmitter.emit('speakFile: file played');				
			}, 500);
		});
	 
	    // the WAVE header is stripped from the output of the reader
	    reader.pipe(speaker);
	});
	 
	// pipe the WAVE file to the Reader instance
	file.pipe(reader);
}

function execNext() {
	queue.shift();

	if (queue[0] && typeof queue[0] === 'function')	queue[0]();
}

module.exports = function(_eventEmitter) {
	eventEmitter = _eventEmitter;

	eventEmitter.on('ftp-client: file copied', addToQueue);

	eventEmitter.on('speakFile: file played', execNext);
}
