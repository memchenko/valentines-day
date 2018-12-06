const fs = require('fs');
const path = require('path');

const Speaker = require('speaker');
const wav = require('wav');

const _ = require('lodash');

const FILES_DIR = require('../../constants/constants.js').DEVICE_FILES_DIR;

let eventEmitter;
let isSpeaking = false;

const queue = [];

const tracks = {
	'horoscopes': {},
	'wishes': [],
	'predictions': [],
	'easter_eggs': [],
	'songs': [],
	'phrases': {
		'greetings': [],
		'jokes': [],
		'questions': {
			'gender': '',
			'zodiac': ''
		}
	}
};

function addTotracks({ filename, label }) {
	const arr = _.get(tracks, label);

	_.set(tracks, label, arr.concat(() => {
		playFile({ filename, label });
	}));
}

function playFile({ filename, label }) {
	const file = fs.createReadStream(path.resolve(FILES_DIR, filename));
	const reader = new wav.Reader();

	// the "format" event gets emitted at the end of the WAVE header
	reader.on('format', function (format) {

		const speaker = new Speaker(format);

		speaker.on('unpipe', () => {
			setTimeout(() => {
				eventEmitter.emit('speakFile: file played', { filename, label });
				resolve();
			}, 500);
		});

			// the WAVE header is stripped from the output of the reader
			reader.pipe(speaker);
	});

	// pipe the WAVE file to the Reader instance
	file.pipe(reader);
}

function removeFromtracks({ label }) {
	return _.get(tracks, label).shift();
}

function rememberFileName({ filename }) {
	fs.appendFile(path.resolve(__dirname, './played-filenames.txt'), `${filename};`, (err) => {
		if (err) {
			console.log("Couldn\'t write filename");
		}
	});
}

function addFromTracksToQueue({ label, isRemove = true, index }) {
	if (isRemove) {
		queue.push(_.get(tracks, label).shift());
	} else if (index !== undefined) {
		queue.push(_.get(tracks, label)[index]);
	}

	if (queue.length === 1) {
		execNext();
	}
}

function execNext() {
	queue[0]();
}

module.exports = function(_eventEmitter) {
	eventEmitter = _eventEmitter;

	eventEmitter.on('ftp-client: file copied', addTotracks);
	eventEmitter.on('speakFile: file played', removeFromtracks);
	eventEmitter.on('speakFile: file played', execNext);
	eventEmitter.on('speakFile: file played', rememberFileName);

	eventEmitter.on('play', addFromTracksToQueue);
	// eventEmitter.on('play:song', { label: 'songs', isRemove: false,  });
}
