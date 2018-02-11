const path = require('path');
const fs = require('fs');
const EventEmitter = require('events');

const express = require('express');
const app = express();

const HTTP_PORT = require('../../constants/constants.js').HTTP_PORT;

const init = require('./init-config.js');

app.use(express.static(path.resolve(__dirname, './assets')));

app.use('/', (req, res) => {
	res.status(200).send('OK');
});

app.all('*', (req, res) => {
	res.status(404).send('The requested page doesn\'t exist');
});

app.listen(HTTP_PORT, () => {
	console.log('The server started at port: ', HTTP_PORT);

	init();
});
