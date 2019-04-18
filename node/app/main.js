const path = require('path');
const fs = require('fs');
const EventEmitter = require('events');
const ee = new EventEmitter();

const express = require('express');
const app = express();

const HTTP_PORT = require('../../constants/constants.js').HTTP_PORT;

const { CHECK_NEW_FILES, AUDIO_FILES, LABELS_TO_PLAY } = require('./constants/messageTypes');

const init = require('./init-config.js');

let ttsProcess = null;
let telegramProcess = null;

app.use(express.static(path.resolve(__dirname, './assets')));

app.use('/ping', (req, res) => {
	res.status(200).send('OK');
});

app.get('/new-files', (req, res) => {
	if (ttsProcess) {
		const handleFilesResponse = (filesArr) => {
			ee.off(AUDIO_FILES, handleFilesResponse);
			res.status(200).send(JSON.stringify(filesArr));
		};
	
		ee.on(AUDIO_FILES, handleFilesResponse);
	
		ttsProcess.send({ type: CHECK_NEW_FILES });
	} else {
		res.status(200).send(JSON.stringify([]));
	}
	
});

app.get('/file/:label/:file', (req, res) => {
	const { label, file } = req.params;

	res.setHeader('x-label', label);
	res.sendFile(path.resolve(__dirname, './files', file));
});

app.get('/orders', (req, res) => {
	if (telegramProcess) {
		const handleLabelsResponse = (labels) => {
			ee.off(handleLabelsResponse);
			res.status(200).send(JSON.stringify(labels));
		};
	
		ee.on(LABELS_TO_PLAY, handleLabelsResponse);
	
		telegramProcess.send({ type: CHECK_NEW_ORDERS });
	} else {
		res.status(200).send(JSON.stringify([]));
	}
});

app.all('*', (req, res) => {
	res.status(404).send('The requested page doesn\'t exist');
});

app.listen(HTTP_PORT, () => {
	console.log('The server started at port: ', HTTP_PORT);

	const { ttsProcess: _ttsProcess, telegramProcess: _telegramProcess } = init();

	const ttsProcess = _ttsProcess;
	const telegramProcess = _telegramProcess;

	ttsProcess.on('message', ({ type, payload }) => {
		if (type === AUDIO_FILES) {
			ee.emit(AUDIO_FILES, payload);
		}
	});

	telegramProcess.on('message', ({ type, payload }) => {
		if (type === LABELS_TO_PLAY) {
			ee.emit(LABELS_TO_PLAY, payload);
		}
	});
});
