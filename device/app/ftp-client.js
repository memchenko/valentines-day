const fs = require('fs');
const path = require('path');

const FtpClient = require('ftp');

const CONSTANTS = require('../../constants/constants');
const FTP_HOST = CONSTANTS.HOST;
const FTP_PORT = CONSTANTS.FTP_PORT;
const FILES_DIR = CONSTANTS.DEVICE_FILES_DIR;

let eventEmitter;

let queue = [];

function addToQueue(filename) {
	// console.log(filename, ' to be created...');

	queue.push(() => {
		createFile(filename);
	});

	if (queue.length === 1) queue[0]();
}

function createFile(filename) {
	// console.log('...creating file: ', filename);

	const filePath = path.resolve(FILES_DIR, filename);

	fs.open(filePath, 'w', undefined, (err, fd) => {
		if (err) {
			return;
		}
		fs.closeSync(fd);

		eventEmitter.emit('ftp-client: file created', filename);
	});
}

function copyFile(filename) {
	const client = new FtpClient();
	// console.log('...copying file: ', filename);

	client.on('ready', () => {
		client.get(filename, (err, stream) => {
			if (err) {
				return;
			}

			stream.once('close', () => {
				client.destroy();

				// console.log('Close ', filename);

				eventEmitter.emit('ftp-client: file copied', filename);
				eventEmitter.emit('ftp-client: ready for next');
			});

			stream.pipe(fs.createWriteStream(path.resolve(FILES_DIR, filename)));
		});
  	});

  	client.connect({
  		host: FTP_HOST,
  		port: FTP_PORT
  	});	
}

function execNext() {
	// console.log('*** exec next ***');

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
