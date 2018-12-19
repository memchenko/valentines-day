let eventEmitter;
const five = require('johnny-five');
const throttle = require('lodash').throttle;
const moves = require('./move-patterns');

const sensorBoard = new five.Board({
  port: 'COM4'
});
const servoBoard = new five.Board({
  port: 'COM3'
});
const stepperBoard = new five.Board({
  port: 'COM5'
});

const PINS = {
  SENSOR_BOARD: {
    MOUTH: 5,
    EYE_1: 6,
    EYE_2: 4,
    SONIC: 7
  },
  BOARD_ARMS: {
    SERVO_1: 4,
    SERVO_2: 9
  },
  STEPPER_BOARD: {
    MOTORS: [9, 10, 11, 12]
  }
};

servoBoard.on('ready', () => {
  const servo1 = new five.Servo({
      pin: PINS.BOARD_ARMS.SERVO_1,
      type: 'continuous',
      board: servoBoard
  });
  const servo2 = new five.Servo({
      pin: PINS.BOARD_ARMS.SERVO_2,
      type: 'continuous',
      board: servoBoard
  });

});

stepperBoard.on('ready', () => {
  const stepper = new five.Stepper({
    type: five.Stepper.TYPE.FOUR_WIRE,
    stepsPerRev: 200,
    pins: PINS.STEPPER_BOARD.MOTORS,
    board: stepperBoard
  });

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

  let doGetData = true;
  const THRESHOLD = 80;
  const getData = throttle(() => {
    if (!doGetData) return;

    if (sonic.cm < THRESHOLD) {
        eventEmitter.fire('tech:sonic:crossed');
    }
  }, 1000);
  sonic.on("data", getData);
});


module.exports = (_eventEmitter) => {
  eventEmitter = _eventEmitter;
};
