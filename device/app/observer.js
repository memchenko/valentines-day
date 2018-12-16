const five = require('johnny-five');
const board = new five.Board();

let eventEmitter;

const PINS = {
  MOUTH: 1,
  EYES: [2,3],
  ULTRASONIC: 4,
  MOTOR: 5
};

const SERIAL_PINS = {
  TX: 6,
  RX: 7
};

board.on('ready', () => {
  const proximity = new five.Proximity({
    controller: "HCSR04",
    pin: PINS.ULTRASONIC
  });

  proximity.on("data", function() {
    console.log("Proximity: ");
    console.log("  cm  : ", this.cm);
    console.log("  in  : ", this.in);
    console.log("-----------------");
  });

  proximity.on("change", function() {
    console.log("The obstruction has moved.");
  });
});

module.exports = (_eventEmitter) => {
  eventEmitter = _eventEmitter;
};
