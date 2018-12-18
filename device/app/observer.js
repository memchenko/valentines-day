const five = require('johnny-five');
// const sensorBoard = new five.Board({
//   port: 'COM4'
// });
// const servoBoard = new five.Board({
//   port: 'COM3'
// });

const stepperBoard = new five.Board({
  port: 'COM5'
});

let eventEmitter;

const PINS = {
  BOARD_1: {
    MOUTH: 5,
    EYE_1: 6,
    EYE_2: 4,
    TRIG: 8,
    ECHO: 7,
    ULTRASONIC: 7,
    STEPPER: [9, 10, 11, 12]
  },
  BOARD_ARMS: {
    SERVO_1: 4,
    SERVO_2: 9
  }
};

// servoBoard.on('ready', () => {
//   const servo1 = new five.Servo({
//       pin: PINS.BOARD_ARMS.SERVO_1,
//       type: 'continuous'
//   });
//   const servo2 = new five.Servo({
//       pin: PINS.BOARD_ARMS.SERVO_2,
//       type: 'continuous'
//   });
//
//   servo1.min();
//   servo2.min();
//   servo1.sweep({
//     range: [10, 90],
//     interval: 500
//   });
//   servo2.sweep({
//     range: [10, 90],
//     interval: 500
//   });
// });

stepperBoard.on('ready', () => {
  const stepper = new five.Stepper({
    type: five.Stepper.TYPE.FOUR_WIRE,
    stepsPerRev: 200,
    pins: PINS.BOARD_1.STEPPER
  });

  stepper.speed(500).step({ steps: 10000, direction: 1 }, function() {
    console.log("Done stepping!");
  });
});

const throttle = require('lodash').throttle;

// sensorBoard.on('ready', () => {
  // const mouth = new five.Led(PINS.BOARD_1.MOUTH);
  // const eye1 = new five.Led(PINS.BOARD_1.EYE_1);
  // const eye2 = new five.Led(PINS.BOARD_1.EYE_2);


  // mouth.on();
  // eye1.on();
  // eye2.on();

  // const sonic = new five.Proximity({
  //   controller: "HCSR04",
  //   pin: 7
  // });
  //
  // const getData = throttle(() => {
  //   console.log("cm: ", sonic.cm);
  // }, 2000);
  //
  // sonic.on("data", getData);
// });


// module.exports = (_eventEmitter) => {
//   eventEmitter = _eventEmitter;
// };
