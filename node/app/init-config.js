const child_process = require('child_process');
const path = require('path');

let ttsProcess;
let ftpProcess

const ttsPath = path.resolve(__dirname, './child-processes/tts/index.js');
const ftpPath = path.resolve(__dirname, './child-processes/ftp/index.js');

module.exports = function(eventEmitter) {
	ttsProcess = child_process.fork(ttsPath);
	ftpProcess = child_process.fork(ftpPath);

	eventEmitter.on('new data', sendToTTSProcess);
};

function sendToTTSProcess(data) {
	console.log('I got new data');
	ttsProcess.send(data);
}
