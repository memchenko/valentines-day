const EventEmitter = require('events');
const http = require('http');
const urlencode = require('urlencode');
const express = require('express');
const app = express();

const got = require('got');

const { DEVICE_MANAGER_ENDPOINT } = require('../../constants/constants');

const PORT = 3131;

const eventEmitter = new EventEmitter();

eventEmitter.setMaxListeners(0);

require('./manager.js')(eventEmitter);

app.get('/', (req, res) => {
	console.log('request /', req.query.label);
	eventEmitter.emit('got filename', {
		label: req.query.label,
		filename: urlencode.decode(req.query.filename)
	});

	res.status(200).send('ok');
});

app.get('/play/wish', (req, res) => {
	console.log('playwish /');

	eventEmitter.emit(USER_COMMAND, 'wishes');

	// eventEmitter.emit('play', { label: 'wishes' });

	res.status(200).send('ok');
});

app.get('/play/horoscope', (req, res) => {
	eventEmitter.emit(USER_COMMAND, `horoscopes.${req.query.zodiac}`);
	// eventEmitter.emit('play', { label: `horoscopes.${req.query.zodiac}`  });

	res.status(200).send('ok');
});

app.get('/play/prediction', (req, res) => {
	eventEmitter.emit(USER_COMMAND, 'predictions');
	// eventEmitter.emit('play', { label: 'predictions' });

	res.status(200).send('ok');
});

// app.get('/play/easter-egg', (req, res) => {
// 	eventEmitter.emit('play', { label: 'easter_eggs' });
//
// 	res.status(200).send('ok');
// });

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

const ip = require('ip');

app.get('*', (req, res) => {
	res.status(200).send('ok');
	console.log('request');
});

app.listen(PORT, () => {
	console.log(ip.address());
	console.log('Server started at port: ', PORT);
});

setInterval(async () => {
	try {
		// files: {filename, label}[]
		// orders: string[]
		const [files, orders] = await Promise.all([
			got('http://18.218.239.19:8080/new-files', { json: true }),
			got('http://18.218.239.19:8080/orders', { json: true })
		]);
		
		console.log('files', files.body);
		console.log('orders', orders.body);

		files.body.forEach(file => eventEmitter.emit('got filename', file));
		orders.body.forEach(order => eventEmitter.emit(USER_COMMAND, order));	
	} catch(err) {
		console.log(err);
	}
}, 3000);

// eventEmitter.on('speakFile:need', (label) => {
// 	http.get(DEVICE_MANAGER_ENDPOINT + '?label=' + label, (res) => {
// 		if (res.statusCode !== 200) throw new Error('Need didn\'t sent');
// 	})
// 	  .on('error', (e) => {
// 	  	console.error('Need didn\'t sent');
// 	  });
// });
