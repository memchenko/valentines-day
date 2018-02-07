const AudioContext = require('web-audio-api').AudioContext;
const context = new AudioContext();
const Speaker = require('speaker');
const urlencode = require('urlencode');
const https = require('https');

const fs = require('fs');
const path = require('path');

function ValentineManager() {}

ValentineManager.prototype.saveMessage = function(data, Valentine, callback) {
	const valentine = new Valentine({
		from: data.from,
		to: data.to.length > 0 ? data.to : "N/A",
		message: data.message
	});

	valentine.save((err, valentine) => {
		if (err) callback(false);

		callback(true);

	});
}

ValentineManager.prototype.getAudio = function(from, to, text) {
	const urlencodedText = urlencode(
		'Валентинка ' + to + (from.length > 0 ? ('от ' + to) : '') + '. ' + text	
	);
	const apiKey = 'd577f014-5cc9-4bc3-95aa-8c122ab94e6c';
	const request = 'https://tts.voicetech.yandex.net/generate?key=' +
		apiKey + '&text=' + urlencodedText +
		'&format=wav&quality=hi&lang=ru-RU&speaker=alyss&speed=1.0&emotion=good';

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
			fs.open(path.resolve(__dirname, 'audio.wav'), 'w', undefined, (err, fd) => {
				fs.write(fd, data, undefined, undefined, undefined, () => {
					fs.closeSync(fd);
					console.log('File has been created!');
				});
			});
		});
	}).on('error', err => console.log(err));
}

module.exports = ValentineManager;