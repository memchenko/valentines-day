const EventEmitter = require('events');
const http = require('http');

const DEVICE_ENDPOINT = require('../../constants/constants.js').DEVICE_ENDPOINT;

const TransformerTTS = require('../../modules/TransformerTTS/TransformerTTS.js');

const transformerTTS = new TransformerTTS();

const fileCounter = 0;

process.on('message', (data) => {
	fileCounter += 1;
	
	const filename = fileCounter + '. ' + data.to;

	const url = transformerTTS.getRequestURL(data);
	const audioBuffer = transformerTTS.getAudioBuffer(url, createFileAndEmitFilename);

	const file = transformerTTS.createFile(filename, audioBuffer);

	file
		.then(() => {
			http.get(DEVICE_IP + '?filename=' + filename, (res) => {
				try {

					if (res.statusCode !== 200) throw new Error('filename hasn\'t been sent');

					console.log('filename has been sent');

				} catch(err) {
					console.error(err.message);
				}
			});			
		})
		.catch((err) => {
			console.log(err);
		});
});
