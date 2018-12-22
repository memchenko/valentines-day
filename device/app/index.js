const EventEmitter = require('events');
const http = require('http');
const urlencode = require('urlencode');
const express = require('express');
const app = express();

const { DEVICE_MANAGER_ENDPOINT } = require('../../constants/constants');

const PORT = 3131;

const eventEmitter = new EventEmitter();

eventEmitter.setMaxListeners(0);

require('./manager.js')(eventEmitter);

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

app.get('/play/joke', (req, res) => {
	eventEmitter.emit('play', { label: 'phrases.jokes' });

	res.status(200).send('ok');
});

app.get('/cacalibrate/head', (req, res) => {
	const {
		direction,
		steps
	} = req.query;

	eventEmitter.emit('tech:calibrate:stepper', { direction, steps });
	res.status(200).send('ok');
});

app.listen(PORT, () => {
	console.log('Server started at port: ', PORT);
});

// eventEmitter.on('speakFile:need', (label) => {
// 	http.get(DEVICE_MANAGER_ENDPOINT + '?label=' + label, (res) => {
// 		if (res.statusCode !== 200) throw new Error('Need didn\'t sent');
// 	})
// 	  .on('error', (e) => {
// 	  	console.error('Need didn\'t sent');
// 	  });
// });
