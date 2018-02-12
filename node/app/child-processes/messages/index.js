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

  messages.getMessages(limit, offset, (err, messages) => {
    if (err) {
      res.status(500).send('Couldn\'t find documents');
      return;
    }

    let result = messages.map((doc) => {
      let message = doc.toObject();

      return {
        ...message,
        isLiked: message.likedIPs.some(ip => ip === req.ip)
      };
    });

    res.set({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Origin': '*'
    });
    res.status(200).send(JSON.stringify(result));
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

  		messages.saveMessage(data, (err, message) => {
  			if (err) {
  				socket.emit('server: message error', 'Не удалось сохранить сообщение');
  				return;
  			}

  			process.send(data);

			  socket.emit('server: message ok');
  			io.sockets.emit('server: new message', message.toObject());
  		});
  	});

    socket.on('client: like message', (message_id) => {
      messages.likeMessage(message_id, socket.handshake.address)
      .then((like) => {
        socket.emit('server: like message ok');
        io.sockets.emit('server: like message', like);
      })
      .catch((err) => {
        socket.emit('server: like message error');
      });
    });

    socket.on('client: unlike message', (message_id) => {
      messages.unlikeMessage(message_id, socket.handshake.address)
      .then((like) => {
        socket.emit('server: unlike message ok');
        io.sockets.emit('server: unlike message', like);
      })
      .catch((err) => {
        socket.emit('server: unlike message error');
      });
    });
});
