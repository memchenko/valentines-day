const path = require('path');
const fs = require('fs');

const express = require('express');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

const PORT = require('./constants/constants.js').PORT;

const TransformerTTS = require('./modules/TransformerTTS/TransformerTTS.js');
const Valentines = require('./db.Valentines.js');

const valentines = new Valentines();

app.use(express.static(path.resolve(__dirname, './assets')));

app.get('/valentines', (req, res) => {
	valentines.getAllValentines((err, docs) => {
		if (err) {
			res.status(500).send('DB error');
			return;
		}

		res.status(200).send(JSON.stringify(docs));
	});	
});

app.all('*', (req, res) => {
	res.status(404).send('The requested page doesn\'t exist');
});

server.listen(PORT, () => {
	console.log('The server started at port: ', PORT);

	// for tts process
	// for ftp-server process
});

io.on('connection', (socket) => {
	io.clients((err, clients) => {
		console.log(clients);
	});

  	socket.on('new valentine', (data) => {
  		valentines.saveValentine(data, (err) => {
  			if (err) {
  				socket.emit('error', 'Could\'t save the valentine');
  				return;
  			}

  			io.sockets.emit('send valentine', data);
  		});
  	});
});
