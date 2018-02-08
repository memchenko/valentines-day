const fs = require('fs');
const path = require('path');

const FtpClient = require('ftp');

const client = new FtpClient();

let eventEmitter;

function downloadFile(filename) {
	try {
		client.on('ready', () => {
			client.get(filename, (err, stream) => {
	  			if (err) throw err;

	  			stream.once('close', () => {
	  				eventEmitter.emit('copied file', filename);
	  				client.end();
	  			});
				stream.pipe(fs.createWriteStream(
					path.resolve(__dirname, './files/' + filename)));
	    	});
	  	});

	  	client.connect({
	  		host: '172.16.1.107',
	  		port: 1111
	  	});
	} catch(err) {
		console.error(err.message);
	}
}

module.exports = function(_eventEmitter) {
	eventEmitter = _eventEmitter;

	eventEmitter.on('got filename', downloadFile);
};
