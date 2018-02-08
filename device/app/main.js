const EventEmitter = require('events');

const urlencode = require('urlencode');
const express = require('express');
const app = express();

const PORT = 3131;

const eventEmitter = new EventEmitter();

const ftpClient = require('./ftp-client.js')(eventEmitter);
const speakFile = require('./speakFile.js')(eventEmitter);

app.get('/', (req, res) => {
	eventEmitter.emit('got filename', urlencode.decode(req.query.filename));

	res.status(200).send('ok');
});

app.listen(PORT, () => {
	console.log('Server started at port: ', PORT);
});


