let eventEmitter;
const five = require('johnny-five');
const throttle = require('lodash').throttle;

const servoBoard = new five.Board({
  port: 'COM3',
  repl: false
});
const sensorBoard = new five.Board({
  port: 'COM10',
  repl: false
});
const PINS = {
  SENSOR_BOARD: {
    MOUTH: 5,
    EYE_1: 6,
    EYE_2: 4,
    SONIC: 7
  },
  BOARD_ARMS: {
    SERVO_1: 9,
    SERVO_2: 4
  },
};
//
servoBoard.on('ready', () => {
  const servo1 = new five.Servo({
      pin: PINS.BOARD_ARMS.SERVO_1,
      board: servoBoard,
      startAt: 175
  });
  const servo2 = new five.Servo({
      pin: PINS.BOARD_ARMS.SERVO_2,
      board: servoBoard,
      startAt: 5
  });

 eventEmitter.emit('tech:servo1:ready', servo1);
 eventEmitter.emit('tech:servo2:ready', servo2);

});

sensorBoard.on('ready', () => {
  const mouth = new five.Led({
      pin: PINS.SENSOR_BOARD.MOUTH,
      board: sensorBoard
  });
  const eye1 = new five.Led({
      pin: PINS.SENSOR_BOARD.EYE_1,
      board: sensorBoard
  });
  const eye2 = new five.Led({
      pin: PINS.SENSOR_BOARD.EYE_2,
      board: sensorBoard
  });
  const sonic = new five.Proximity({
      controller: "HCSR04",
      pin: PINS.SENSOR_BOARD.SONIC,
      board: sensorBoard
  });

  const turnOnEyes = () => {
    eye1.on();
    eye2.on();
  };
  const strobeMouth = () => {
    mouth.strobe(500);
  };
  const turnOffEyes = () => {
    eye1.off();
    eye1.off();
  };
  const turnOffMouth = () => {
    mouth.off();
  };

  eventEmitter.on('tech:turn-on:eyes', turnOnEyes);
  eventEmitter.on('tech:strobe-mouth', strobeMouth);
  eventEmitter.on('tech:turn-off:eyes', turnOffEyes);
  eventEmitter.on('tech:turn-off:mouth', turnOffMouth);
  eventEmitter.emit('tech:sonic:ready', sonic);

  let doGetData = true;
  const THRESHOLD = 80;
  const getData = throttle(() => {
      console.log(sonic.cm);
    if (!doGetData || sonic.cm === 0) return;

    if (sonic.cm < THRESHOLD) {
        eventEmitter.emit('tech:sonic:crossed');
    }
  }, 1000);
  sonic.on("data", getData);
});


module.exports = (_eventEmitter) => {
  eventEmitter = _eventEmitter;
};
