const EventEmitter = require('events');

const urlencode = require('urlencode');
const express = require('express');
const app = express();

const PORT = 3131;

const eventEmitter = new EventEmitter();

eventEmitter.setMaxListeners(0);

const ftpClient = require('./ftp-client.js')(eventEmitter);
const speakFile = require('./speakFile.js')(eventEmitter);

app.get('/', (req, res) => {
	eventEmitter.emit('got filename', {
		label: req.query.label,
		filename: urlencode.decode(req.query.filename)
	});

	res.status(200).send('ok');
});

app.get('/play/wish', (req, res) => {
	eventEmitter.emit('play', { label: 'wishes' });

	res.status(200).send('ok');
});

app.get('/play/horoscope', (req, res) => {
	eventEmitter.emit('play', { label: `horoscopes.${req.query.zodiac}`  });

	res.status(200).send('ok');
});

app.get('/play/prediction', (req, res) => {
	eventEmitter.emit('play', { label: 'predictions' });

	res.status(200).send('ok');
});

app.get('/play/easter-egg', (req, res) => {
	eventEmitter.emit('play', { label: 'easter_eggs' });

	res.status(200).send('ok');
});

app.listen(PORT, () => {
	console.log('Server started at port: ', PORT);
});
