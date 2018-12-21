const path = require('path');

module.exports = {
	HOST: '13.59.100.117',
	HTTP_PORT: 8080,
	MESSAGES_PORT: 3000,
	PAINTING_PORT: 3030,
	FTP_PORT: 1111,
	SERVER_FILES_DIR: path.resolve(__dirname, '../node/app/files'),

	DEVICE_FILES_DIR: path.resolve(__dirname, '../device/app'),
	DEVICE_ENDPOINT: 'http://100.80.248.50:3131',
  DEVICE_MANAGER_ENDPOINT: 'http://13.59.100.117:8090'
};
