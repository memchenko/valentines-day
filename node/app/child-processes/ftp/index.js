const fs = require('fs');
const path = require('path');

const FtpSvr = require('ftp-srv');

const CONSTANTS = require('../../../constants/constants.js');

const HOSTNAME = CONSTANTS.HOST;
const FTP_PORT = CONSTANTS.FTP_PORT;
const FILES_DIR = CONSTANTS.SERVER_FILES_DIR

const ftpServer = new FtpSvr(`ftp://${HOSTNAME}:${FTP_PORT}`, { anonymous: true, greeting: ["Hey"] });

ftpServer.on('login', (data, resolve, reject) => {
	resolve({ root: FILES_DIR });
	reject(new Error());
});

ftpServer.on('client-error', (connection, context, error) => {
	console.log ( 'connection: ' + connection );
	console.log ( 'context: ' + context );
	console.log ( 'error: ' + error );
});

ftpServer.listen()
	.then(() => {
		if (!fs.existSync(FILES_DIR)) fs.mkdirSync(FILES_DIR);

	  	console.log ( `Server running at http: ${HOSTNAME}:${FTP_PORT}/` );
	});