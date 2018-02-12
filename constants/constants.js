const path = require('path');

module.exports = {
	HOST: '172.16.1.107',
	HTTP_PORT: 8080,
	MESSAGES_PORT: 3000,
	PAINTING_PORT: 3030,
	FTP_PORT: 1111,
	SERVER_FILES_DIR: path.resolve(__dirname, '../node/app/files'),

	DEVICE_FILES_DIR: path.resolve(__dirname, '../device/app/files'),
	DEVICE_ENDPOINT: 'http://172.16.1.107:3131'
};
