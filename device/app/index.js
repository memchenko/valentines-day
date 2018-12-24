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

	eventEmitter.emit('move:calibrate:stepper', { direction, steps });
	res.status(200).send('ok');
});

app.get('/coconfig', (req, res) => {
	const {
        stepAmpl, stepSpeed, stepSwAmpl, stepSwSpeed, lMinAngle, rMinAngle,
        lMaxAngle, rMaxAngle, armSpeed, armInterval
	} = req.query;
	const newConfig = { stepper: {}, servo: {} };

	(stepAmpl !== undefined) && (newConfig.stepper.amplitude = stepAmpl);
	(stepSpeed !== undefined) && (newConfig.stepper.speed = stepSpeed);
	(stepSwAmpl !== undefined) && (newConfig.stepper.sweepAmplitude = stepSwAmpl);
	(stepSwSpeed !== undefined) && (newConfig.stepper.sweepSpeed = stepSwSpeed);
	(lMinAngle !== undefined) && (newConfig.servo.minLeftAngle = lMinAngle);
	(rMinAngle !== undefined) && (newConfig.servo.minRightAngle = rMinAngle);
	(lMaxAngle !== undefined) && (newConfig.servo.maxLeftAngle = lMaxAngle);
	(rMaxAngle !== undefined) && (newConfig.servo.maxRightAngle = rMaxAngle);
	(armSpeed !== undefined) && (newConfig.servo.speed = armSpeed);
	(armInterval !== undefined) && (newConfig.servo.sweepInterval = armInterval);

	eventEmitter.emit('move:change-config', newConfig);
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
