const child_process = require('child_process');
const path = require('path');
const { NEW_MESSAGE } = require('./constants/messageTypes.js')

let ttsProcess;
let ftpProcess;
let messagesProcess;
let paintingProcess;
let telegramProcess;

const ttsPath = path.resolve(__dirname, './child-processes/tts/index.js');
const ftpPath = path.resolve(__dirname, './child-processes/ftp/index.js');
const messagesPath = path.resolve(__dirname, './child-processes/messages/index.js');
const paintingPath = path.resolve(__dirname, './child-processes/painting/index.js');
const telegramPath = path.resolve(__dirname, './child-processes/telegram/index.js');

module.exports = function() {
	ttsProcess = child_process.fork(ttsPath);
	ftpProcess = child_process.fork(ftpPath);
	telegramProcess = child_process.fork(telegramPath);

	telegramProcess.on('message', sendToTTSProcess);

	// messagesProcess = child_process.fork(messagesPath);
	// paintingProcess = child_process.fork(paintingPath);

	// messagesProcess.on('message', sendToTTSProcess);

	return {
		ttsProcess,
		// ftpProcess,
		telegramProcess
	};
};

function sendToTTSProcess(payload) {
	if (payload.type === 'msg') {
		ttsProcess.send({ type: NEW_MESSAGE, payload });
	}
}
