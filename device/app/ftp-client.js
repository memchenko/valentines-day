const fs = require('fs');
const path = require('path');

const FtpClient = require('ftp');

const client = new FtpClient();

let eventEmitter;

let queue = [];

async function copyNextAfterCurrent(filename) {
	await queue[0];
	queue.unshift(copyFileFromServer(filename));
	queue.pop();
}

function addFileToQueue(filename) {
	if (queue.length === 0) {
		queue[0] = copyFileFromServer(filename);
	} else {
		copyNextAfterCurrent(filename);
	}
}

function copyFileFromServer(filename) {
	const promise = new Promise((resolve, reject) => {
		fs.open(path.resolve(__dirname, './files/' + filename), 'w', undefined, (err, fd) => {
			if (err) reject(err);
			fs.closeSync(fd);
			resolve();
		});
	});

	return new Promise((resolve, reject) => {
		promise
			.then(() => {
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
						stream.pipe(fs.createWriteStream(path.resolve(__dirname, './files/' + filename)));
					});
			  	});

			  	client.connect({
			  		host: '192.168.0.92',
			  		port: 1111
			  	});
			})
			.catch(err => console.error(err));
	});		
}

module.exports = function(_eventEmitter) {
	eventEmitter = _eventEmitter;

	eventEmitter.on('got filename', addFileToQueue);
};
