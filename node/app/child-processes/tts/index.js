const util = require('util');
const EventEmitter = require('events');
const path = require('path');
const http = require('http');
const exec = util.promisify(require('child_process').exec);
const urlencode = require('urlencode');

const DEVICE_ENDPOINT = require('../../../../constants/constants.js').DEVICE_ENDPOINT;

const TransformerTTS = require('../../modules/TransformerTTS/TransformerTTS.js');

const transformerTTS = new TransformerTTS();

let characters = 5000000;

process.on('message', (data) => {
console.log(data);
	let filename = data.label + Date.now().toString(36) + '.mp3';
	let filePath = path.resolve(__dirname, '../../files/' + filename);
	let file;
	let audioBuffer;

	const cmdCommand = transformerTTS.getCmdCommand({ ...data, filename: filePath });

	async function getBufferAndWriteFile() {
		try {
			const { stdout, stderr } = await exec(cmdCommand);

			characters -= stdout ? +JSON.parse(stdout).RequestCharacters : 0;

const label = data.label;
			const normLabel = label === 'Пожелание' && 'wishes' ||
				label === 'Предсказание' && 'predictions' ||
				label === 'Сообщение' && 'wishes';

console.log('ENDPOINT', DEVICE_ENDPOINT);
console.log(filename);
console.log(data.label);

			http.get(DEVICE_ENDPOINT + '?filename=' + filename + '&label=' + normLabel, (res) => {
console.log(res.statusCode);
				if (res.statusCode !== 200) throw new Error('Filename hasn\'t been sent');
			}).on('error', (e) => {
				console.error('Device is not available');
			});
		} catch(err) {
			console.error(err);
		}
	}

	getBufferAndWriteFile();
});
