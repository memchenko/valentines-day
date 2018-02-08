const fs = require('fs');
const path = require('path');

const Speaker = require('speaker');
const wav = require('wav');

let eventEmitter;

let queue = [];

async function playNextAfterCurrent(filename) {
	await queue[0];
	queue.unshift(playFile(filename));
}

function addToQueue(filename) {
	if (queue.length === 0) {
		queue[0] = playFile(filename);
	} else {
		playNextAfterCurrent(filename);
	}
}

function playFile(filename) {
	const file = fs.createReadStream(path.resolve(__dirname, './files/' + filename));
	const reader = new wav.Reader();

	return new Promise((resolve, reject) => {
		// the "format" event gets emitted at the end of the WAVE header 
		reader.on('format', function (format) {
		 
		  // the WAVE header is stripped from the output of the reader 
		  reader.pipe(new Speaker(format));
		});
		 
		// pipe the WAVE file to the Reader instance 
		file.pipe(reader);
		file.on('end', () => {
			queue.pop();
			resolve();
		});
	});	
}

module.exports = function(_eventEmitter) {
	eventEmitter = _eventEmitter;

	eventEmitter.on('copied file', (filename) => {
		addToQueue(filename);
	});
}
