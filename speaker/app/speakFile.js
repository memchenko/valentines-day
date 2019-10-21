const fs = require('fs');
const path = require('path');

const Speaker = require('speaker');
const lame = require('lame');
const loudness = require('loudness');

const _ = require('lodash');

const FILES_DIR = require('../../constants/constants.js').DEVICE_FILES_DIR;

let eventEmitter;

let songsCounter = 0;
let greetingsCounter = 0;
let wishesCounter = 0;
let predictionsCounter = 0;
let demonGreetsCounter = 0;
let demonCounter = 0;

let aquarC = 0;
let pisceC = 0;
let ariesC = 0;
let tauruC = 0;
let geminC = 0;
let rakC = 0;
let leoC = 0;
let virgoC = 0;
let libraC = 0;
let scorpC = 0;
let sagitC = 0;
let capriC = 0;

const queue = [];
const songsQueue = [
    () => { playSong('./songs/4.mp3') },
    () => { playSong('./songs/5.mp3') },
    () => { playSong('./songs/6.mp3') },
    () => { playSong('./songs/1.mp3') },
    () => { playSong('./songs/2.mp3') },
    () => { playSong('./songs/3.mp3') },
    () => { playSong('./songs/7.mp3') }
];
const greetQueue = [
    () => { playGreeting('./greets/1.mp3') },
    () => { playGreeting('./greets/16.mp3') },
    () => { playGreeting('./greets/2.mp3') },
    () => { playGreeting('./greets/15.mp3') },
    () => { playGreeting('./greets/3.mp3') },
    () => { playGreeting('./greets/14.mp3') },
    () => { playGreeting('./greets/4.mp3') },
    () => { playGreeting('./greets/13.mp3') },
    () => { playGreeting('./greets/5.mp3') },
    () => { playGreeting('./greets/12.mp3') },
    () => { playGreeting('./greets/6.mp3') },
    () => { playGreeting('./greets/11.mp3') },
    () => { playGreeting('./greets/7.mp3') },
    () => { playGreeting('./greets/10.mp3') },
    () => { playGreeting('./greets/8.mp3') },
    () => { playGreeting('./greets/9.mp3') },
];
const demonGreetQueue = [
    () => { playDemonGreeting('./demonGreets/smeh.mp3') },
    () => { playDemonGreeting('./demonGreets/smeh1.mp3') },
    () => { playDemonGreeting('./demonGreets/vedma.mp3') },
    () => { playDemonGreeting('./demonGreets/krik.mp3') },
];
const demon = [
  () => { playFile({ filename: './demon/demon2.mp3', label: 'standart', isStandart: true }) },
  () => { playFile({ filename: './demon/demon1.mp3', label: 'standart', isStandart: true }) },
  () => { playFile({ filename: './demon/demon3.mp3', label: 'standart', isStandart: true }) },
  () => { playFile({ filename: './demon/demon4.mp3', label: 'standart', isStandart: true }) },
];

const fallbacks = {
	'wishes': [
        () => { playFile({ filename: './wishes/wish1.mp3', label: 'standart', isStandart: true }) },
        () => { playFile({ filename: './wishes/wish2.mp3', label: 'standart', isStandart: true }) },
        () => { playFile({ filename: './wishes/wish3.mp3', label: 'standart', isStandart: true }) },
        () => { playFile({ filename: './wishes/wish4.mp3', label: 'standart', isStandart: true }) },
        () => { playFile({ filename: './wishes/wish5.mp3', label: 'standart', isStandart: true }) },
        () => { playFile({ filename: './wishes/wish6.mp3', label: 'standart', isStandart: true }) },
        () => { playFile({ filename: './wishes/wish7.mp3', label: 'standart', isStandart: true }) },
        () => { playFile({ filename: './wishes/wish8.mp3', label: 'standart', isStandart: true }) },
        () => { playFile({ filename: './wishes/wish9.mp3', label: 'standart', isStandart: true }) },
        () => { playFile({ filename: './wishes/wish10.mp3', label: 'standart', isStandart: true }) },
	],
	'predictions': [
        () => { playFile({ filename: './predictions/pred1.mp3', label: 'standart', isStandart: true }) },
        () => { playFile({ filename: './predictions/pred2.mp3', label: 'standart', isStandart: true }) },
        () => { playFile({ filename: './predictions/pred3.mp3', label: 'standart', isStandart: true }) },
        () => { playFile({ filename: './predictions/pred4.mp3', label: 'standart', isStandart: true }) },
        () => { playFile({ filename: './predictions/pred5.mp3', label: 'standart', isStandart: true }) },
        () => { playFile({ filename: './predictions/pred6.mp3', label: 'standart', isStandart: true }) },
        () => { playFile({ filename: './predictions/pred7.mp3', label: 'standart', isStandart: true }) },
        () => { playFile({ filename: './predictions/pred8.mp3', label: 'standart', isStandart: true }) },
    ],
    'horoscopes': {
        'aquar': [
            () => { playFile({ filename: './horoscope/vodo1.mp3', label: 'horoscopes.aquar' }) },
            () => { playFile({ filename: './horoscope/vodo2.mp3', label: 'horoscopes.aquar' }) },
            () => { playFile({ filename: './horoscope/vodo3.mp3', label: 'horoscopes.aquar' }) },
        ],
        'pisce': [
            () => { playFile({ filename: './horoscope/ryb1.mp3', label: 'horoscopes.pisce' }) },
            () => { playFile({ filename: './horoscope/ryb2.mp3', label: 'horoscopes.pisce' }) },
            () => { playFile({ filename: './horoscope/ryb3.mp3', label: 'horoscopes.pisce' }) },
        ],
        'aries': [
            () => { playFile({ filename: './horoscope/oven1.mp3', label: 'horoscopes.aries' }) },
            () => { playFile({ filename: './horoscope/oven2.mp3', label: 'horoscopes.aries' }) },
            () => { playFile({ filename: './horoscope/oven3.mp3', label: 'horoscopes.aries' }) },
        ],
        'tauru': [
            () => { playFile({ filename: './horoscope/telec1.mp3', label: 'horoscopes.tauru' }) },
            () => { playFile({ filename: './horoscope/telec2.mp3', label: 'horoscopes.tauru' }) },
            () => { playFile({ filename: './horoscope/telec3.mp3', label: 'horoscopes.tauru' }) },
        ],
        'gemin': [
            () => { playFile({ filename: './horoscope/bliz1.mp3', label: 'horoscopes.gemin' }) },
            () => { playFile({ filename: './horoscope/bliz2.mp3', label: 'horoscopes.gemin' }) },
            () => { playFile({ filename: './horoscope/bliz3.mp3', label: 'horoscopes.gemin' }) },
        ],
        'rak': [
            () => { playFile({ filename: './horoscope/rak1.mp3', label: 'horoscopes.rak' }) },
            () => { playFile({ filename: './horoscope/rak2.mp3', label: 'horoscopes.rak' }) },
            () => { playFile({ filename: './horoscope/rak3.mp3', label: 'horoscopes.rak' }) },
        ],
        'leo': [
            () => { playFile({ filename: './horoscope/leo1.mp3', label: 'horoscopes.leo' }) },
            () => { playFile({ filename: './horoscope/leo2.mp3', label: 'horoscopes.leo' }) },
            () => { playFile({ filename: './horoscope/leo3.mp3', label: 'horoscopes.leo' }) },
        ],
        'virgo': [
            () => { playFile({ filename: './horoscope/dev1.mp3', label: 'horoscopes.virgo' }) },
            () => { playFile({ filename: './horoscope/dev2.mp3', label: 'horoscopes.virgo' }) },
            () => { playFile({ filename: './horoscope/dev3.mp3', label: 'horoscopes.virgo' }) },
        ],
        'libra': [
            () => { playFile({ filename: './horoscope/ves1.mp3', label: 'horoscopes.libra' }) },
            () => { playFile({ filename: './horoscope/ves2.mp3', label: 'horoscopes.libra' }) },
            () => { playFile({ filename: './horoscope/ves3.mp3', label: 'horoscopes.libra' }) },
        ],
        'scorp': [
            () => { playFile({ filename: './horoscope/scorp1.mp3', label: 'horoscopes.scorp' }) },
            () => { playFile({ filename: './horoscope/scorp2.mp3', label: 'horoscopes.scorp' }) },
            () => { playFile({ filename: './horoscope/scorp3.mp3', label: 'horoscopes.scorp' }) },
        ],
        'sagit': [
            () => { playFile({ filename: './horoscope/strel1.mp3', label: 'horoscopes.sagit' }) },
            () => { playFile({ filename: './horoscope/strel2.mp3', label: 'horoscopes.sagit' }) },
            () => { playFile({ filename: './horoscope/strel3.mp3', label: 'horoscopes.sagit' }) },
        ],
        'capri': [
            () => { playFile({ filename: './horoscope/koz1.mp3', label: 'horoscopes.capri' }) },
            () => { playFile({ filename: './horoscope/koz2.mp3', label: 'horoscopes.capri' }) },
            () => { playFile({ filename: './horoscope/koz3.mp3', label: 'horoscopes.capri' }) },
        ]
    }
};

const tracks = {
	'horoscopes': {
        'aquar': [],
        'pisce': [],
        'aries': [],
        'tauru': [],
        'gemin': [],
        'rak': [],
        'leo': [],
        'virgo': [],
        'libra': [],
        'scorp': [],
        'sagit': [],
        'capri': []
	},
	'wishes': [],
	'predictions': [],
	'demon': [],
	'easter_eggs': [],
	'phrases': {
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

function playGreeting(filename) {
    let decoder = new lame.Decoder();
    let spkr;
    let format;
    const file = fs.createReadStream(path.resolve(FILES_DIR, filename));
    loudness.setVolume(100, (err) => {
      if (err) {
        console.log(err);
        return;
      }
    });
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

function playDemonGreeting(filename) {
    let decoder = new lame.Decoder();
    let spkr;
    let format;
    const file = fs.createReadStream(path.resolve(FILES_DIR, filename));
    loudness.setVolume(100, (err) => {
      if (err) {
        console.log(err);
        return;
      }
    });
    file.pipe(decoder);

    decoder.on('format', (_format) => {
        format = _format;
        spkr = new Speaker(format);

        spkr.on('unpipe', () => {
            setTimeout(() => {
                console.log('greet end');
                eventEmitter.emit('speakFile:greet:end');
            }, 2000);

            if (demonGreetsCounter === (demonGreetQueue.length - 1)) {
                demonGreetsCounter = 0;
            } else {
                demonGreetsCounter += 1;
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
        spkr = null;
        decoder = null;
        setTimeout(() => {
            console.log('pausing');
            eventEmitter.emit('speakFile:song:paused');
        }, 7000);
    };

    const onResume = () => {
        console.log('resuming');
        spkr = new Speaker(format);
        decoder = new lame.Decoder();

        loudness.setVolume(40, (err) => {
          if (err) {
            console.log(err);
            return;
          }
        });

        spkr.on('unpipe', () => {
            eventEmitter.off('speakFile:song:pause', onPause);
            eventEmitter.off('speakFile:song:resume', onResume);

            console.log('speaker unpiping');

            setTimeout(() => {
                eventEmitter.emit('speakFile:song:end');
            }, 6000);

            if (songsCounter === (songsQueue.length - 1)) {
                songsCounter = 0;
            } else {
                songsCounter += 1;
            }

            decoder = null;
            spkr = null;
        });

        file.pipe(decoder).pipe(spkr);
    };

    loudness.setVolume(40, (err) => {
      if (err) {
        console.log(err);
        return;
      }
    });

	decoder.on('format', (_format) => {
		format = _format;
		spkr = new Speaker(format);

		spkr.on('unpipe', () => {
			eventEmitter.off('speakFile:song:pause', onPause);
			eventEmitter.off('speakFile:song:resume', onResume);

			console.log('speaker unpiping');

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

  loudness.setVolume(100, (err) => {
    if (err) {
      console.log(err);
      return;
    }
  });

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

function rememberFileName({ filename, isStandart }) {
	if (isStandart) return;
	fs.appendFile(path.resolve(__dirname, './played-filenames.txt'), `${filename};`, (err) => {
		if (err) {
			console.log("Couldn\'t write filename");
		}
	});
}

function addFromTracksToQueue({ label, isRemove = true, index }) {
	console.log('label add', label);
	if (isRemove) {
		const arr = _.get(tracks, label);

		if (arr.length === 0) {
		    switch (label) {
                case 'demon': {
                    queue.push(demon[demonCounter]);
                    demonCounter = demonCounter === demon.length - 1 ? 0 : demonCounter + 1;
                    break;
                }
                case 'wishes': {
                    queue.push(fallbacks.wishes[wishesCounter]);
                    wishesCounter = wishesCounter === fallbacks.wishes.length - 1 ? 0 : wishesCounter + 1;
                    break;
                }
                case 'predictions': {
                    queue.push(fallbacks.predictions[predictionsCounter]);
                    predictionsCounter = predictionsCounter === fallbacks.predictions.length - 1 ? 0 : predictionsCounter + 1;
                    break;
                }
                case 'horoscopes.aquar': {
                    queue.push(fallbacks.horoscopes.aquar[aquarC]);
                    aquarC = aquarC === 2 ? 0 : aquarC + 1;
                    break;
                }
                case 'horoscopes.pisce': {
                    queue.push(fallbacks.horoscopes.pisce[pisceC]);
                    pisceC = pisceC === 2 ? 0 : pisceC + 1;
                    break;
                }
                case 'horoscopes.aries': {
                    queue.push(fallbacks.horoscopes.aries[ariesC]);
                    ariesC = ariesC === 2 ? 0 : ariesC + 1;
                    break;
                }
                case 'horoscopes.tauru': {
                    queue.push(fallbacks.horoscopes.tauru[tauruC]);
                    tauruC = tauruC === 2 ? 0 : tauruC + 1;
                    break;
                }
                case 'horoscopes.gemin': {
                    queue.push(fallbacks.horoscopes.gemin[geminC]);
                    geminC = geminC === 2 ? 0 : geminC + 1;
                    break;
                }
                case 'horoscopes.rak': {
                    queue.push(fallbacks.horoscopes.rak[rakC]);
                    rakC = rakC === 2 ? 0 : rakC + 1;
                    break;
                }
                case 'horoscopes.leo': {
                    queue.push(fallbacks.horoscopes.leo[leoC]);
                    leoC = leoC === 2 ? 0 : leoC + 1;
                    break;
                }
                case 'horoscopes.virgo': {
                    queue.push(fallbacks.horoscopes.virgo[virgoC]);
                    virgoC = virgoC === 2 ? 0 : virgoC + 1;
                    break;
                }
                case 'horoscopes.libra': {
                    queue.push(fallbacks.horoscopes.libra[libraC]);
                    libraC = libraC === 2 ? 0 : libraC + 1;
                    break;
                }
                case 'horoscopes.scorp': {
                    queue.push(fallbacks.horoscopes.scorp[scorpC]);
                    scorpC = scorpC === 2 ? 0 : scorpC + 1;
                    break;
                }
                case 'horoscopes.sagit': {
                    queue.push(fallbacks.horoscopes.sagit[sagitC]);
                    sagitC = sagitC === 2 ? 0 : sagitC + 1;
                    break;
                }
                case 'horoscopes.capri': {
                    queue.push(fallbacks.horoscopes.capri[capriC]);
                    capriC = capriC === 2 ? 0 : capriC + 1;
                    break;
                }
                default: {
                    queue.push(fallbacks.wishes[wishesCounter]);
                    wishesCounter = wishesCounter === fallbacks.wishes.length - 1 ? 0 : wishesCounter + 1;
                }
            }
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

function addFromDemonGreetsToQueue() {
    demonGreetQueue[demonGreetsCounter]();
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
	eventEmitter.on('speakFile:play:end:file', execNext);
	eventEmitter.on('speakFile:play:end:file', rememberFileName);

	eventEmitter.on('play', addFromTracksToQueue);
	eventEmitter.on('speakFile:song:play', addFromSongsToQueue);
	eventEmitter.on('speakFile:greet:play', addFromGreetsToQueue);
	eventEmitter.on('speakFile:demon-greet:play', addFromDemonGreetsToQueue);
	// eventEmitter.on('play:song', { label: 'songs', isRemove: false,  });
};
