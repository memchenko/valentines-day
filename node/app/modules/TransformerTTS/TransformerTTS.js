const https = require('https');
const fs = require('fs');
const path = require('path');
const urlencode = require('urlencode');

const FILES_DIR = require('../../../../constants/constants.js').SERVER_FILES_DIR;

function TransformerTTS() {
	this.labels = ['Предсказание', 'Пожелание', 'Гороскоп', 'Секрет', 'Идея', 'Шутка'];
	this.speakers = ['Maxim', 'Tatyana'];
}

TransformerTTS.prototype.getLabel = function(label) {
	if (this.labels.some(el => el === label)) return label;

	return 'Сообщение';
};

TransformerTTS.prototype.getSpeaker = function(speaker) {
	if (this.speakers.some(item => item === speaker)) {
		return speaker;
	}

	return this.speakers[0];
};

TransformerTTS.prototype.getCmdCommand = function({
	to, from, label, message, speaker, filename
}) {
	const normalizedFrom = from.length > 0 ? ('от ' + from) : '';
	const text = `${this.getLabel(label)} ${to} ${normalizedFrom}. ${message}`;
	const command = 'aws polly synthesize-speech';
	const options = [
		`--output-format mp3`,
		`--voice-id ${this.getSpeaker(speaker)}`,
		`--text "${text}"`,
		`${filename}`
	];

 	return command + ' ' + options.join(' ');
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

				resolve();
			});
		});
	});
}

module.exports = TransformerTTS;
