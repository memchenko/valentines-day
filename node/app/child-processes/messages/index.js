const express = require('express');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/app');

const Messages = require('../../db/Messages.js');
const messages = new Messages(mongoose);

const MESSAGES_PORT = require('../../../../constants/constants.js').MESSAGES_PORT;

app.get('/api/messages', (req, res) => {
	const offset = +req.query.offset;
	const limit = +req.query.limit;

	messages.getMessages(limit, offset, (err, docs) => {
		if (err) {
			res.status(500).send('Couldn\'t find documents');
			return;
		}

		res.set({
			'Content-Type': 'application/json',
			'Cache-Control': 'no-cache',
      		'Access-Control-Allow-Methods': 'GET',
  			'Access-Control-Allow-Origin': '*'
		});
		res.status(200).send(JSON.stringify(docs));
	});	
});

app.all('*', (req, res) => {
	res.status(404).send('The requested page doesn\'t exist');
});

server.listen(MESSAGES_PORT, () => {
	console.log('Messages server started at port: ', MESSAGES_PORT);
});

io.on('connection', (socket) => {
  	socket.on('client: put message', (data) => {
  		const inputValidation = messages.validateInput(data);

  		if (inputValidation !== 'OK') {
  			socket.emit('server: message error', inputValidation);
  			return;
  		}

  		messages.saveMessage(data, (err) => {
  			if (err) {
  				socket.emit('server: message error', 'Не удалось сохранить сообщение');
  				return;
  			}

  			process.send(data);

			  socket.emit('server: message ok');
  			io.sockets.emit('server: new message', data);
  		});
  	});

    socket.on('client: like message', (message_id) => {
      return;
    });
});
