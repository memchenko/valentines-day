const express = require('express');
const app = express();

const EventEmitter = require('events');

const PORT = 3131;

const eventEmitter = new EventEmitter();

app.get('/filename', (req, res) => {
	eventEmitter.emit('got filename', req.query.filename);

	res.status(200).send('ok');
});

app.listen(PORT, () => {
	console.log('Server started at port: ', PORT);
});


