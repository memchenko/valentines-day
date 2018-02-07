const TransformerTTS = require('../../modules/TransformerTTS/TransformerTTS.js');

const transformerTTS = new TransformerTTS();

const fileCounter = 0;

process.on('message', (data) => {
	fileCounter += 1;
	
	const filename = fileCounter + '. ' + data.to;

	const url = transformerTTS.getRequestURL(data);
	const buffer = transformerTTS
		.getAudioBuffer(url, transformerTTS.createFile(filename));

	// then push filenamae to mqtt queue
});
