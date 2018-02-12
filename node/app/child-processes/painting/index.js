const express = require('express');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/app');

const Paintings = require('../../db/Paintings.js');
const paintings = new Paintings(mongoose);

const PAINTING_PORT = require('../../../../constants/constants.js').PAINTING_PORT;

app.get('/api/paintings', (req, res) => {
	const height = paintings.getCanvasHeight();

	paintings.getAllPaintings((err, docs) => {
		if (err) {
			res.status(500).send('Couldn\'t find documents');
			return;
		}

		const canvas = {
			height: height,
			paintings: docs
		};

    res.set({
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Origin': '*'
    });
		res.status(200).send(JSON.stringify(canvas));
	});	
});

app.all('*', (req, res) => {
	res.status(404).send('The requested page doesn\'t exist');
});

server.listen(PAINTING_PORT, () => {
	console.log('Paintings server started at port: ', PAINTING_PORT);
});

io.on('connection', (socket) => {
  	socket.on('client: put shape', (data) => {
  		paintings.savePainting(data, (err) => {
  			if (err) {
  				socket.emit('server: shape error', 'Не удалось сохранить рисунок');
  				return;
  			}

			socket.emit('server: shape ok');
  			io.sockets.emit('server: new shape', data);
  		});
  	});

  	socket.on('client: add space', () => {
  		const newHeight = +paintings.getCanvasHeight() + 50;

  		const clientIP = socket.handshake.address;

  		if (paintings.isIPCatched(clientIP)) {
  			socket.emit('server: add space error');
  			return;
		  }

  		paintings.putNewIP(clientIP)
  		.then(() => {
  			paintings.saveCanvasHeight(newHeight)
	  		.then((newHeight) => {
	  			socket.emit('server: add space ok');
	  			io.sockets.emit('server: add space', newHeight);
	  		})
	  		.catch((err) => {
	  			socket.emit('server: add space error');
	  		});
  		})
  		.catch((err) => {
  			socket.emit('server: add space error');
  		});  		
  	});
});
