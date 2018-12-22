const fs = require('fs');
const path = require('path');

const Speaker = require('speaker');
const lame = require('lame');

const _ = require('lodash');

const FILES_DIR = require('../../constants/constants.js').DEVICE_FILES_DIR;

let eventEmitter;

const queue = [];
const songsQueue = [
    () => { playSong('5.mp3') },
    () => { playSong('1.mp3') },
];
const greetQueue = [
	() => { playGreeting('greet.mp3') }
];

let songsCounter = 0;
let greetingsCounter = 0;

const tracks = {
	'horoscopes': {},
	'wishes': [
        () => { playFile({ filename: '6.mp3', label: 'wishes' }) },
	],
	'predictions': [
        () => { playFile({ filename: '6.mp3', label: 'predictions' }) },
	],
	'easter_eggs': [],
	'phrases': {
		'jokes': [
            () => { playFile({ filename: '6.mp3', label: 'phrases.jokes' }) },
		],
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

function playGreeting(filename) {
    let decoder = new lame.Decoder();
    let spkr;
    let format;
    const file = fs.createReadStream(path.resolve(FILES_DIR, filename));

    file.pipe(decoder);

    decoder.on('format', (_format) => {
        format = _format;
        spkr = new Speaker(format);

        spkr.on('unpipe', () => {
            setTimeout(() => {
                console.log('greet end');
                eventEmitter.emit('speakFile:greet:end');
            }, 2000);

            if (greetingsCounter === (greetQueue.length - 1)) {
                greetingsCounter = 0;
            } else {
                greetingsCounter += 1;
            }
        });

        decoder.pipe(spkr);
    });
}

function playSong(filename) {
	let decoder = new lame.Decoder();
	let spkr;
	let format;
	const file = fs.createReadStream(path.resolve(FILES_DIR, filename));

	file.pipe(decoder);

    const onPause = () => {
        console.log('unpiping');
        file.unpipe();
        // spkr = null;
        // decoder = null;
        setTimeout(() => {
            console.log('pausing');
            eventEmitter.emit('speakFile:song:paused');
        }, 7000);
    };

    const onResume = () => {
        console.log('resuming');
        file.pipe(new lame.Decoder()).pipe(new Speaker(format));
    };

	decoder.on('format', (_format) => {
		format = _format;
		spkr = new Speaker(format);

        spkr.on('unpipe', () => {
            eventEmitter.off('speakFile:song:pause', onPause);
            eventEmitter.off('speakFile:song:resume', onResume);

            setTimeout(() => {
                eventEmitter.emit('speakFile:song:end');
            }, 5000);

            if (songsCounter === (songsQueue.length - 1)) {
                songsCounter = 0;
            } else {
                songsCounter += 1;
            }
        });

		decoder.pipe(spkr);
	});

	eventEmitter.on('speakFile:song:pause', onPause);
	eventEmitter.on('speakFile:song:resume', onResume);
}

function playFile({ filename, label, isStandart = false }) {
	let decoder = new lame.Decoder();
	let spkr;
	let format;
	const file = fs.createReadStream(path.resolve(FILES_DIR, filename));

	file.pipe(decoder);

	decoder.on('format', (_format) => {
		format = _format;
		spkr = new Speaker(format);

        spkr.on('unpipe', () => {
            setTimeout(() => {
				console.log('filename', filename);
				console.log('speakFile label', label);

                if (queue.length < 1) {
                    eventEmitter.emit('speakFile:play:end:file', !isStandart ? { filename, label, isStandart } : {});
                    eventEmitter.emit('speakFile:play:totalend:file', !isStandart ? { filename, label, isStandart } : {});
                } else {
                    eventEmitter.emit('speakFile:play:end:file', !isStandart ? { filename, label, isStandart } : {});
                }
            }, 2000);
        });

		decoder.pipe(spkr);
	});
}

// function removeFromtracks({ label }) {
// 	console.log('label Rem', label);
// 	const arr = _.get(tracks, label);
//
// 	console.log(tracks[label]);
// 	if (arr.length === 5) {
// 		eventEmitter.emit('speakFile:need', label);
// 	}
//
// 	return arr.shift();
// }

function rememberFileName({ filename, isStandart }) {
	if (isStandart) return;
	fs.appendFile(path.resolve(__dirname, './played-filenames.txt'), `${filename};`, (err) => {
		if (err) {
			console.log("Couldn\'t write filename");
		}
	});
}

function addFromTracksToQueue({ label, isRemove = true, index }) {
	console.log('label', label);
	if (isRemove) {
		const arr = _.get(tracks, label);

		if (arr.length === 0) {
			// TODO добавить заглушку
			queue.push(() => { playFile({ filename: '6.mp3', isStandart: true }) });
		} else {
            queue.push(arr.shift());
		}
	} else if (index !== undefined) {
		queue.push(_.get(tracks, label)[index]);
	}

	if (queue.length === 1) {
		console.log('executing');
		execNext();
	}
}

function addFromSongsToQueue() {
    songsQueue[songsCounter]();
}

function addFromGreetsToQueue() {
	greetQueue[greetingsCounter]();
}

function execNext() {
	if (queue.length > 0) {
		queue[0]();
        queue.shift();
	} else {

	}
}

module.exports = function(_eventEmitter) {
	eventEmitter = _eventEmitter;

	eventEmitter.on('ftp-client: file copied', addTotracks);
	// eventEmitter.on('speakFile:play:end:file', removeFromtracks);
	eventEmitter.on('speakFile:play:end:file', execNext);
	eventEmitter.on('speakFile:play:end:file', rememberFileName);

	eventEmitter.on('play', addFromTracksToQueue);
	eventEmitter.on('speakFile:song:play', addFromSongsToQueue);
	eventEmitter.on('speakFile:greet:play', addFromGreetsToQueue);
	// eventEmitter.on('play:song', { label: 'songs', isRemove: false,  });
};
