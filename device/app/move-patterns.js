const fs = require('fs');

let eventEmitter;
let currentAngle = 0;
let isMoving = false;
let SERVO = {
    minRightAngle: 10,
    minLeftAngle: 90,
    maxRightAngle: 90,
    maxLeftAngle: 10,
    speed: 1000,
    sweepInterval: 1000
};
let STEPPER = {
    currentAngle: 0,
    amplitude: 300,
    cwDir: 0,
    ccwDir: 1,
    fullTurn: 900,
    speed: 500,
    sweepSpeed: 1000,
    sweepAmplitude: 150
};

const getConfig = () => {
  const buf = fs.readFileSync('./move.config.json');
  return JSON.parse(buf.toString());
};

const changeConfig = ({ servo = {}, stepper = {} }) => {
  Object.keys(servo).forEach((prop) => {
      if (!(prop in SERVO)) return;
      SERVO[prop] = servo[prop];
  });

  Object.keys(stepper).forEach((prop) => {
      if (!(prop in STEPPER)) return;
      STEPPER[prop] = stepper[prop];
  });

  fs.writeFileSync('./move.config.json', JSON.stringify({ SERVO, STEPPER }));
};

const liftRightArm = (servo) => {
  servo.to(SERVO.maxRightAngle, SERVO.speed);

  const cb = () => {
      isMoving = false;
      servo.off('move:complete', cb);
      eventEmitter.emit('move:right-arm:lifted');
  };

  servo.on('move:complete', cb);
};

const liftLeftArm = (servo) => {
  servo.to(SERVO.maxLeftAngle, SERVO.speed);

  const cb = () => {
      servo.off('move:complete', cb);
      eventEmitter.emit('move:left-arm:lifted');
  };

  servo.on('move:complete', cb);
};

const lowerRightArm = (servo) => {
  servo.to(SERVO.minRightAngle, SERVO.speed);

  const cb = () => {
      servo.off('move:complete', cb);
      eventEmitter.emit('move:right-arm:lowered');
  };

  servo.on('move:complete', cb);
};

const lowerLeftArm = (servo) => {
  servo.to(SERVO.minLeftAngle, SERVO.speed);

  const cb = () => {
      servo.off('move:complete', cb);
      eventEmitter.emit('move:left-arm:lowered');
  };

  servo.on('move:complete', cb);
};

const liftBothArms = (leftServo, rightServo) => {
  let isAnyFinished = false;
  leftServo.to(SERVO.maxLeftAngle, SERVO.speed);
  rightServo.to(SERVO.maxRightAngle, SERVO.speed);

  const cb = () => {
    if (!isAnyFinished) {
      isAnyFinished = true;
    } else {
      leftServo.off('move:complete', cb);
      rightServo.off('move:complete', cb);
      eventEmitter.emit('move:both-arms:lifted');
    }
  };

  leftServo.on('move:complete', cb);
  rightServo.on('move:complete', cb);
};

const lowerBothArms = (leftServo, rightServo) => {
  let isAnyFinished = false;
  leftServo.to(SERVO.minLeftAngle, SERVO.speed);
  rightServo.to(SERVO.minRightAngle, SERVO.speed);

  const cb = () => {
    if (!isAnyFinished) {
      isAnyFinished = true;
    } else {
      leftServo.off('move:complete', cb);
      rightServo.off('move:complete', cb);
      eventEmitter.emit('move:both-arms:lowered');
    }
  };

  leftServo.on('move:complete', cb);
  rightServo.on('move:complete', cb);
};

const sweepArms = (leftServo, rightServo) => {
  leftServo.sweep({
      range: [SERVO.minLeftAngle, SERVO.maxLeftAngle],
      interval: SERVO.sweepInterval
  });
  rightServo.sweep({
      range: [SERVO.minRightAngle, SERVO.maxRightAngle],
      interval: SERVO.sweepInterval
  });

  return () => {
    let isAnyFinished = false;
    leftServo.stop();
    rightServo.stop();

    return new Promise((resolve, reject) => {
        const cb = () => {
            if (!isAnyFinished) {
                isAnyFinished = true;
            } else {
                leftServo.off('move:complete', cb);
                rightServo.off('move:complete', cb);
                resolve();
            }
        };

        leftServo.on('move:complete', cb);
        rightServo.on('move:complete', cb);

        leftServo.to(SERVO.minLeftAngle, SERVO.speed);
        rightServo.to(SERVO.minRightAngle, SERVO.speed);
    });
  };
};

const turnHeadToCenter = (stepper) => {
  let steps = 0;
  let direction = STEPPER.cwDir;

  if (currentAngle < 0) {
    steps = -currentAngle;
    direction = STEPPER.cwDir;
  }
  else if (currentAngle > 0) {
    steps = currentAngle;
    direction = STEPPER.ccwDir;
  }
  else {
    eventEmitter.emit('move:head:centered');
    return;
  }

  stepper.speed(STEPPER.speed).step({ steps, direction }, () => {
    currentAngle = 0;
    eventEmitter.emit('move:head:centered');
  });
};

const turnHeadLeft = (stepper) => {
  let steps = 0;
  let direction = STEPPER.cwDir;

  if (currentAngle === -STEPPER.amplitude) {
    eventEmitter.emit('move:head:left');
    return;
  }
  else if (currentAngle < 0 && currentAngle > -STEPPER.amplitude) {
    steps = STEPPER.amplitude + currentAngle;
    direction = STEPPER.ccwDir;
  }
  else if (currentAngle < 0 && currentAngle < -STEPPER.amplitude) {
    steps = -currentAngle - STEPPER.amplitude;
    direction = STEPPER.cwDir;
  }
  else if (currentAngle > 0) {
    steps = currentAngle + STEPPER.amplitude;
    direction = STEPPER.ccwDir;
  }
  else if (currentAngle === 0) {
    steps = STEPPER.amplitude;
    direction = STEPPER.ccwDir;
  }

  stepper.speed(STEPPER.speed).step({ steps, direction }, () => {
    currentAngle = 0;
    eventEmitter.emit('move:head:left');
  });
};

const turnHeadRight = (stepper) => {
  let steps = 0;
  let direction = STEPPER.cwDir;

  if (currentAngle === STEPPER.amplitude) {
    eventEmitter.emit('move:head:right');
    return;
  }
  else if (currentAngle < 0) {
    steps = -currentAngle + STEPPER.amplitude;
    direction = STEPPER.cwDir;
  }
  else if (currentAngle > 0 && currentAngle < STEPPER.amplitude) {
    steps = STEPPER.amplitude - currentAngle;
    direction = STEPPER.cwDir;
  }
  else if (currentAngle > 0 && currentAngle > STEPPER.amplitude) {
    steps = currentAngle - STEPPER.amplitude;
    direction = STEPPER.ccwDir;
  }

  stepper.speed(STEPPER.speed).step({ steps, direction }, () => {
    currentAngle = 0;
    eventEmitter.emit('move:head:right');
  });
};

const turnAround = (stepper) => {
  let steps = 0;
  const direction = STEPPER.ccwDir;

  if (currentAngle === STEPPER.fullTurn) {
    eventEmitter.emit('move:head:turned');
    return;
  } else {
    steps = STEPPER.fullTurn + currentAngle;
  }

  stepper.speed(STEPPER.speed).step({ steps, direction }, () => {
    currentAngle = STEPPER.fullTurn;
    eventEmitter.emit('move:head:turned');
  });
};

const sweepHead = (stepper) => {
  let isFinishing = false;
  const goLeft = () => {
    stepper.speed(STEPPER.sweepSpeed).step({
      steps: STEPPER.amplitude,
      direction: STEPPER.cwDir,
      accel: 10,
      deccel: 10
    }, () => {
      if (isFinishing) {
        turnHeadToCenter(stepper);
        return;
      }
      eventEmitter.emit('head:local:left');
    });
  };
  const goRight = () => {
    stepper.speed(STEPPER.sweepSpeed).step({
      steps: STEPPER_SWEEP_AMPLITUDE,
      direction: STEPPER.ccwDir,
      accel: 10,
      deccel: 10
    }, () => {
      if (isFinishing) {
        turnHeadToCenter(stepper);
        return;
      }
      eventEmitter.emit('head:local:right');
    });
  };

  eventEmitter.on('head:local:left', goRight);
  eventEmitter.on('head:local:right', goLeft);

  const cb = () => {
    goLeft();
    eventEmitter.off('move:head:centered', cb);
  };

  eventEmitter.on('move:head:centered', cb);
  turnHeadToCenter(stepper);

  return () => {
    isFinishing = true;
    eventEmitter.off('head:local:left', goRight);
    eventEmitter.off('head:local:right', goLeft);
  };
};

const calibrateStepper = ({ steps, direction }) => (stepper) => {
  stepper.speed(STEPPER.speed).step({ steps, direction }, () => {
    eventEmitter.emit('head:calibrated');
  });
};

let isRequired = false;

module.exports = (_eventEmitter) => {
  if (isRequired) return;
  isRequired = true;

  const config = getConfig();
  STEPPER = config.STEPPER;
  SERVO = config.SERVO;
  eventEmitter = _eventEmitter;

  eventEmitter.on('move:change-config', changeConfig);

  return {
      liftRightArm, liftLeftArm, liftBothArms,
      lowerRightArm, lowerLeftArm, lowerBothArms, sweepArms,
      turnHeadLeft, turnHeadToCenter, turnHeadRight,
      turnAround, sweepHead, calibrateStepper
  };
};
