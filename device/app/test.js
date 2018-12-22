const five = require('johnny-five');

const stepperBoard = new five.Board({
  port: 'COM4',
  repl: false
});

const servoBoard = new five.Board({
    port: 'COM3',
    repl: false
});

// const sensorBoard = new five.Board({
//     port: 'COM6',
//     repl: false
// });

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
    STEPPER_BOARD: {
        MOTORS: [9, 10, 11, 12]
    }
};

let SERVO = {
    minRightAngle: 90,
    minLeftAngle: 160,
    maxRightAngle: 160,
    maxLeftAngle: 90,
    speed: 1000,
    sweepInterval: 1000
};

// stepperBoard.on('ready', () => {
//   const stepper = new five.Stepper({
//     type: five.Stepper.TYPE.FOUR_WIRE,
//     stepsPerRev: 200,
//     pins: [9, 10, 11, 12],
//     board: stepperBoard
//   });
//
//   stepper.cw().speed(600).step({ steps: 2000 }, () => {
//     stepper.ccw().speed(600).step({ steps: 600 }, () => {
//       console.log('finish');
//     })
//   })
// });

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

    servo1.to(SERVO.minLeftAngle, SERVO.speed);
    servo2.to(10, SERVO.speed);

    servo1.to(160, SERVO.speed);
//     servo1.on('move:complete', () => {
//         servo1.to(SERVO.maxLeftAngle, SERVO.speed);
//     })
});
