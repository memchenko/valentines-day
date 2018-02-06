const path = require('path');

const express = require('express');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost:27017/valentines');
const Valentine = mongoose.model('messages', new Schema({
	from: String,
	to: String,
	message: String
}));

const PORT = 3000;

const Init = require('./modules/Init/Init.js');
const ValentineManager = require('./modules/ValentineManager/ValentineManager.js');

app.use(express.static(path.resolve(__dirname, './assets')));

app.get('/valentines', (req, res) => {
	const valentines = new Init().getAllValentines(Valentine, (err, docs) => {
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
});

io.on('connection', (socket) => {
	io.clients((err, clients) => {
		console.log(clients);
	});

  	socket.on('new valentine', (data) => {
  		const valentineManager = new ValentineManager();

  		valentineManager.saveMessage(data, Valentine, (isOk) => {
  			if (!isOk) {
  				socket.emit('error', 'Can\'t save the message');
  				return;
  			}

  			io.sockets.emit('send valentine', data);
  		});
  	});
});