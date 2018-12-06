const fs = require('fs');
const path = require('path');

const FtpClient = require('ftp');

const CONSTANTS = require('../../constants/constants');
const FTP_HOST = CONSTANTS.HOST;
const FTP_PORT = CONSTANTS.FTP_PORT;
const FILES_DIR = CONSTANTS.DEVICE_FILES_DIR;

let eventEmitter;

const queue = {
	'horoscopes': [],
	'wishes': [],
	'predictions': [],
	'songs': [],
	'easter_eggs': []
};

function addToQueue({ filename, label }) {
	queue[label].push(() => {
		createFile({ filename, label });
	});

	if (queue[label].length === 1) queue[label][0]();
}

function createFile({ filename, label }) {
	const filePath = path.resolve(FILES_DIR, filename);

	fs.open(filePath, 'w', undefined, (err, fd) => {
		if (err) {
			return;
		}
		fs.closeSync(fd);

		eventEmitter.emit('ftp-client: file created', { filename, label });
	});
}

function copyFile({ filename, label }) {
	const client = new FtpClient();

	client.on('ready', () => {
		client.get(filename, (err, stream) => {
			if (err) {
				return;
			}

			stream.once('close', () => {
				client.destroy();

				eventEmitter.emit('ftp-client: file copied', { filename, label });
				eventEmitter.emit('ftp-client: ready for next');
			});

			stream.pipe(fs.createWriteStream(path.resolve(FILES_DIR, filename)));
		});

  	client.connect({
  		host: FTP_HOST,
  		port: FTP_PORT
  	});
}

function execNext() {
	queue = queue.slice(1);

	if (queue[0] && typeof queue[0] === 'function') queue[0]();
}

module.exports = function(_eventEmitter) {
	eventEmitter = _eventEmitter;

	if (!fs.existsSync(FILES_DIR)) fs.mkdirSync(FILES_DIR);

	eventEmitter.on('got filename', addToQueue);

	eventEmitter.on('ftp-client: ready for next', execNext);
	eventEmitter.on('ftp-client: file created', copyFile);
};
