const util = require('util');
const EventEmitter = require('events');
const path = require('path');
const http = require('http');
const exec = util.promisify(require('child_process').exec);
const urlencode = require('urlencode');

const DEVICE_ENDPOINT = require('../../../../constants/constants.js').DEVICE_ENDPOINT;
const { NEW_MESSAGE, CHECK_NEW_FILES, AUDIO_FILES } = require('../../constants/messageTypes.js');
const TransformerTTS = require('../../modules/TransformerTTS/TransformerTTS.js');

const transformerTTS = new TransformerTTS();

let characters = 5000000;

let files = [];

process.on('message', ({ type, payload }) => {
	switch (type) {
		case NEW_MESSAGE: {
			transformToAudio(payload);
			break;
		}
		case CHECK_NEW_FILES: {
			responseWithFilesData();
		}
	}
});

function transformToAudio(data) {
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

			files.push({ filename, label: normLabel });
		} catch(err) {
			console.error(err);
		}
	}

	getBufferAndWriteFile();
}

function responseWithFilesData() {
	process.send({ type: AUDIO_FILES, payload: files });
	files = [];
}
