const child_process = require('child_process');

let ttsProcess;
let ftpProcess

module.exports = function(eventEmitter) {
	ttsProcess = child_process.fork('./child-processes/tts/index.js');
	ftpProcess = child_process.fork('./child-processes/ftp/index.js');

	eventEmitter.on('new data', sendToTTSProcess);
};

function sendToTTSProcess(data) {
	ttsProcess.send(data);
}
