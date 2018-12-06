const johnnyFive = require('johnny-five');

let eventEmitter;

const PINS = {
  MOUTH: 1,
  EYES: [2,3],
  ULTRASONIC: 4
};

const SERIAL_PINS = {
  TX: 5,
  RX: 6
};


module.exports = (_eventEmitter) => {
  eventEmitter = _eventEmitter;
};
