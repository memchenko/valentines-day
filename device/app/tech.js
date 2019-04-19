const {
  EYES_ON, EYES_OFF, MOUTH_ON, MOUTH_OFF,
  SERVO_L_READY, SERVO_R_READY, SONIC_CROSSED
} = require('./constants.js');

let eventEmitter;
const five = require('johnny-five');
const throttle = require('lodash').throttle;

const servoBoard = new five.Board({
  port: 'COM3',
  repl: false
});
const sensorBoard = new five.Board({
  port: 'COM8',
  repl: false
});

servoBoard.on('error', () => {
  console.log('Can\'t connect servo board');

  eventEmitter.emit('no:servo:board');
  eventEmitter.emit(SERVO_L_READY);
  eventEmitter.emit(SERVO_R_READY);
});

sensorBoard.on('error', () => {
  console.log('Can\'t connect sensor board');

  eventEmitter.emit('no:sensor:board');
  eventEmitter.emit('tech:sonic:ready');
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

servoBoard.on('ready', () => {
  const servo_l = new five.Servo({
      pin: PINS.BOARD_ARMS.SERVO_L,
      board: servoBoard,
      startAt: 175
  });
  const servo_r = new five.Servo({
      pin: PINS.BOARD_ARMS.SERVO_R,
      board: servoBoard,
      startAt: 5
  });

 eventEmitter.emit(SERVO_L_READY, servo_l);
 eventEmitter.emit(SERVO_R_READY, servo_r);
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
    eye2.off();
  };
  const turnOffMouth = () => {
    mouth.off();
  };

  eventEmitter.on(EYES_ON, turnOnEyes);
  eventEmitter.on(MOUTH_ON, strobeMouth);
  eventEmitter.on(EYES_OFF, turnOffEyes);
  eventEmitter.on(MOUTH_OFF, turnOffMouth);

  eventEmitter.emit('tech:sonic:ready', sonic);

  let doGetData = true;
  const THRESHOLD = 80;
  const getData = throttle(() => {
    if (!doGetData || sonic.cm === 0) return;

    if (sonic.cm < THRESHOLD) {
        eventEmitter.emit(SONIC_CROSSED);
    }
  }, 500);
  sonic.on("data", getData);
});

module.exports = (_eventEmitter) => {
  eventEmitter = _eventEmitter;
};
