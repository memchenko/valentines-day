const path = require('path');

module.exports = {
	HOST: '192.168.0.92',
	HTTP_PORT: 3000,
	FTP_PORT: 1111,
	FILES_DIR: path.resolve(__dirname, '../files'),

	DEVICE_ENDPOINT: 'http://192.168.0.92:3131'
};
