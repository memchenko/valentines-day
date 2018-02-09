const fs = require('fs');
const path = require('path');

const FtpClient = require('ftp');

const CONSTANTS = require('../../constants/constants');
const FTP_HOST = CONSTANTS.HOST;
const FTP_PORT = CONSTANTS.PORT;
const FILES_DIR = CONSTANTS.DEVICE_FILES_DIR;

const client = new FtpClient();

let eventEmitter;

let queue = [];

async function copyNextAfterCurrent(filename) {
	await queue[0];
	queue.unshift(init(filename));
	queue.pop();
}

function addFileToQueue(filename) {
	if (queue.length === 0) {
		queue[0] = init(filename);
	} else {
		copyNextAfterCurrent(filename);
	}
}

function createFile(filename) {
	return new Promise((resolve, reject) => {
		fs.open(path.resolve(DEVICE_FILES_DIR, filename), 'w', undefined, (err, fd) => {
			if (err) {
				reject(err);
				return;
			}
			fs.closeSync(fd);
			resolve();
		});
	});
}

async function copyFile(filename, resolve, reject) {
	try {
		await createFile(filename);
	} catch(err) {
		console.error(error);
		return;
	}

	client.on('ready', () => {
		client.get(filename, (err, stream) => {
			if (err) {
				reject(err);
				return;
			}

			stream.once('close', () => {
				client.end();
				resolve();
				eventEmitter.emit('copied file', filename);
			});
			stream.pipe(fs.createWriteStream(path.resolve(DEVICE_FILES_DIR, filename)));
		});
  	});

  	client.connect({
  		host: FTP_HOST,
  		port: FTP_PORT
  	});
}

function init(filename) {
	return new Promise((resolve, reject) => {
		copyFile(filename, resolve, reject);
	});		
}

module.exports = function(_eventEmitter) {
	eventEmitter = _eventEmitter;

	if (!fs.existSync(FILES_DIR)) fs.mkdirSync(FILES_DIR);

	eventEmitter.on('got filename', addFileToQueue);
};
