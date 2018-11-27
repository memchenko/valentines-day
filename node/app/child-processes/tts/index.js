const EventEmitter = require('events');
const http = require('http');

const urlencode = require('urlencode');

const DEVICE_ENDPOINT = require('../../../../constants/constants.js').DEVICE_ENDPOINT;

const TransformerTTS = require('../../modules/TransformerTTS/TransformerTTS.js');

const transformerTTS = new TransformerTTS();

let fileCounter = 0;

process.on('message', (data) => {
	fileCounter += 1;
	
	let filename = fileCounter + '. ' + data.to + '.wav';
	let file;
	let audioBuffer;

	const url = transformerTTS.getRequestURL(data);

	async function getBufferAndWriteFile() {
		try {
			audioBuffer = await transformerTTS.getAudioBuffer(url);
			await transformerTTS.createFile(filename, audioBuffer);
		} catch(err) {
			console.error(err);
		}		

		filename = urlencode(filename);

		http.get(DEVICE_ENDPOINT + '?filename=' + filename, (res) => {
			if (res.statusCode !== 200) throw new Error('Filename hasn\'t been sent');
		}).on('error', (e) => {
			console.error('Device is not available');
		});
	}

	getBufferAndWriteFile();
});
