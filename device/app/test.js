const five = require('johnny-five');

const stepperBoard = new five.Board({
  port: 'COM5',
  repl: false
});

stepperBoard.on('ready', () => {
  const stepper = new five.Stepper({
    type: five.Stepper.TYPE.FOUR_WIRE,
    stepsPerRev: 200,
    pins: [9, 10, 11, 12],
    board: stepperBoard
  });

  stepper.cw().speed(500).step({ steps: 600 }, () => {
    stepper.ccw().speed(500).step({ steps: 600 }, () => {
      console.log('finish');
    })
  })
});
