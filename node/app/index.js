const path = require('path');
const fs = require('fs');

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

	const valentineManager = new ValentineManager();

	valentineManager.getAudioBuffer(
		valentineManager.getRequestURL({
			to: 'кому-угодно',
			from: 'кого-угодно',
			text: 'бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-бла-блят'
		}), 
		(data) => {
			fs.open(path.resolve(__dirname, 'audio.wav'), 'w', undefined, (err, fd) => {
				fs.write(fd, data, undefined, undefined, undefined, () => {
					fs.closeSync(fd);
					console.log('File has been created!');
				});
			});
		}
	);
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

const FtpSvr = require('ftp-srv');

const hostname = '172.16.1.107';
const port = 1111;

const ftpServer = new FtpSvr('ftp://' + hostname + ':' + port, { anonymous: true, greeting: ["Hey"] });

ftpServer.on('login', (data, resolve, reject) => {
	resolve({ root: path.resolve(__dirname, 'files') });
	reject("error");
});

ftpServer.on('client-error', (connection, context, error) => {
	console.log ( 'connection: ' + connection );
	console.log ( 'context: ' + context );
	console.log ( 'error: ' + error );
});

ftpServer.listen()
.then(() => {
  console.log ( `Server running at http: ${hostname}:${port}/` );
});