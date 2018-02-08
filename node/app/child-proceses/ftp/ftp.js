const FtpSvr = require('ftp-srv');

const constants = require('../../constants/constants.js');

const HOSTNAME = constants.HOST;
const PORT = constants.FTP_PORT;

const ftpServer = new FtpSvr('ftp://' + HOSTNAME + ':' + PORT, { anonymous: true, greeting: ["Hey"] });

ftpServer.on('login', (data, resolve, reject) => {
	resolve({ root: path.resolve(__dirname, '../../files') });
	reject(new Error());
});

ftpServer.on('client-error', (connection, context, error) => {
	console.log ( 'connection: ' + connection );
	console.log ( 'context: ' + context );
	console.log ( 'error: ' + error );
});

ftpServer.listen()
	.then(() => {
	  console.log ( `Server running at http: ${HOSTNAME}:${PORT}/` );
	});