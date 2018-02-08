const https = require('https');
const fs = require('fs');
const path = require('path');
const urlencode = require('urlencode');

const FILES_DIR = require('../../constants/constants.js').FILES_DIR;

function TransformerTTS() {
	this.url = 'https://tts.voicetech.yandex.net/generate';
	this.apiKey = 'd577f014-5cc9-4bc3-95aa-8c122ab94e6c';
}

TransformerTTS.prototype.getRequestURL = function(data) {
	const urlencodedText = urlencode(
		'Валентинка ' + data.to +
		(data.from.length > 0 ? ('от ' + data.from) : '') +
		'. ' + data.text	
	);
	
	return this.url + '?key=' + this.apiKey + '&text=' + urlencodedText +
		'&format=wav&quality=hi&lang=ru-RU&speaker=alyss&speed=1.0&emotion=good';
}

TransformerTTS.prototype.getAudioBuffer = function(request) {
	let buffer;

	return new Promise((resolve, reject) => {
		https.get(request, (res) => {
			res.on('data', (chunk) => {
				if (!Buffer.isBuffer(buffer)) {
					buffer = chunk;
				} else {
					buffer = Buffer.concat([buffer, chunk], buffer.length + chunk.length);
				}
			});

			res.on('end', () => {
				resolve(buffer);
			});
		}).on('error', err => reject(err));
	});	
}

TransformerTTS.prototype.createFile = function(filename, data) {
	return new Promise((resolve, reject) => {
		fs.open(path.resolve(FILES_DIR, filename), 'w', undefined, (err, fd) => {
			if (err) {
				reject(err);
				return;
			}

			fs.write(fd, data, undefined, undefined, undefined, (err, bytesWritten, buffer) => {
				if (err) {
					reject(err);
					return;
				}

				fs.closeSync(fd);
				console.log('File has been created!');

				resolve();
			});
		});
	});
}

module.exports = TransformerTTS;