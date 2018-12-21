const fs = require('fs');
const path = require('path');

const Speaker = require('speaker');
const lame = require('lame');

const _ = require('lodash');

const FILES_DIR = require('../../constants/constants.js').DEVICE_FILES_DIR;

let eventEmitter;

const queue = [];

let songsCounter = 0;
let greetingsCounter = 0;

const tracks = {
	'horoscopes': {},
	'wishes': [],
	'predictions': [],
	'easter_eggs': [],
	'songs': ['2.mp3', '3.mp3', '4.mp3'],
	'phrases': {
		'greetings': ['1.mp3'],
		'jokes': [],
		'questions': {
			'gender': '',
			'zodiac': ''
		}
	}
};

function addTotracks({ filename, label }) {
	const arr = _.get(tracks, label);

	console.log('track has added', filename, label);
	_.set(tracks, label, arr.concat(() => {
		playFile({ filename, label });
	}));
}

function playFile({ filename, label }) {
	let decoder = new lame.Decoder();
	let spkr;
	let format;
	const file = fs.createReadStream(path.resolve(FILES_DIR, filename));

	file.pipe(decoder);

	decoder.on('format', (_format) => {
		format = _format;
		spkr = new Speaker(format);

		decoder.pipe(spkr);
	});

	const onPause = () => {
		file.unpipe();
		spkr = null;
		decoder = null;
	};

	const onResume = () => {
		file.pipe(new lame.Decoder()).pipe(new Speaker(format));
	};

	if (label === 'songs') {
		eventEmitter.on('speakFile:play:pause', onPause);
		eventEmitter.on('speakFile:play:resume', onResume);
	}

	file.on('end', () => {
		eventEmitter.off('speakFile:play:pause', onPause);
		eventEmitter.off('speakFile:play:resume', onResume);

		if (label === 'songs') {
			eventEmitter.emit('speakFile:play:end:song', { filename, label });
		} else if (label === 'phrases.greetings') {
			eventEmitter.emit('speakFile:play:end:greeting', { filename, label });
		} else {
			if (queue.length <= 1) {
				eventEmitter.emit('speakFile:play:end:file', { filename, label });
			} else {
				eventEmitter.emit('speakFile:play:end:file', { filename, label });
				eventEmitter.emit('speakFile:play:totalend:file', { filename, label });
			}
		}
	});
}

function removeFromtracks({ label }) {
	const arr = _.get(tracks, label);

	if (arr.length === 5) {
		eventEmitter.emit('speakFile:need', label);
	}

	return arr.shift();
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
	eventEmitter.on('speakFile:play:end:file', removeFromtracks);
	eventEmitter.on('speakFile:play:end:file', execNext);
	eventEmitter.on('speakFile:play:end:file', rememberFileName);

	eventEmitter.on('play', addFromTracksToQueue);
	// eventEmitter.on('play:song', { label: 'songs', isRemove: false,  });
};
