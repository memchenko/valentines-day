import FtpClient from 'ftp';

class FtpLoadStrategy {
  constructor(config) {
    this._client = new FtpClient();
    this._config = config;
    this._queue = [];
    this._isReady = false;

    this._init();
  }

  _init() {
    const {
      host, port, user, password,
      connTimeout, pasvTimeout, keepAlive,
    } = this._config;

    this._client.connect({
      host,
      port,
      user,
      password,
      pasvTimeout,
      keepAlive,
      connTimeout
    });

    this._client.on('ready', () => {
      this._isReady = true;
      this._releaseQueue();
    });

    this._client.on('error', this._throwConnError);
  }

  _releaseQueue() {

  }

  _throwConnError() {
    throw new Error('Unable to connect to ftp server');
  }


  load(filename) {
    if (!this._isReady) {
      return this._queue.push(() => this.load(filename));
    }

    return new Promise((resolve, reject) => {

    });
  }
}

export default FtpLoadStrategy;
