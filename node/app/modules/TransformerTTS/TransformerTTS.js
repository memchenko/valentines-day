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

TransformerTTS.prototype.getAudioBuffer = function(request, callback) {
	let buffer;

	https.get(request, (res) => {
		res.on('data', (chunk) => {
			if (!Buffer.isBuffer(buffer)) {
				buffer = chunk;
			} else {
				buffer = Buffer.concat([buffer, chunk], buffer.length + chunk.length);
			}
		});

		res.on('end', () => {
			callback(buffer);
		});
	}).on('error', err => console.log(err));
}

TransformerTTS.prototype.createFile = function(filename) {
	return function(buffer) {
		fs.open(path.resolve(FILES_DIR, filename), 'w', undefined, (err, fd) => {
			fs.write(fd, data, undefined, undefined, undefined, () => {
				fs.closeSync(fd);
				console.log('File has been created!');
			});
		});
	};	
}

module.exports = TransformerTTS;