const https = require('https');
const fs = require('fs');
const path = require('path');
const urlencode = require('urlencode');

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
	let data;

	https.get(request, (res) => {
		res.on('data', (chunk) => {
			if (!Buffer.isBuffer(data)) {
				data = chunk;
			} else {
				data = Buffer.concat([data, chunk], data.length + chunk.length);
			}
		});

		res.on('end', () => {
			callback(data);
		});
	}).on('error', err => console.log(err));
}

module.exports = TransformerTTS;