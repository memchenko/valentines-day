let eventEmitter;

const RIGHT_ARM_MIN_ANGLE = 10;
const LEFT_ARM_MIN_ANGLE = 90;
const RIGHT_ARM_MAX_ANGLE = 90;
const LEFT_ARM_MAX_ANGLE = 10;
const SPEED = 1000;

let currentAngle = 0;
const AMPLITUDE = 300;
const CW_STEP_DIR = 1;
const CCW_STEP_DIR = 0;
const STEPPER_FULL_TURN = 900;
const STEPPER_SPEED = 500;
const STEPPER_SWEEP_SPEED = 1000;
const STEPPER_SWEEP_AMPLITUDE = 150;

const liftRightArm = (servo) => {
  servo.to(RIGHT_ARM_MAX_ANGLE, SPEED);
  eventEmitter.fire('move:right-arm:lifted');
};

const liftLeftArm = (servo) => {
  servo.to(LEFT_ARM_MAX_ANGLE, SPEED);
  eventEmitter.fire('move:left-arm:lifted');
};

const lowerRightArm = (servo) => {
  servo.to(RIGHT_ARM_MIN_ANGLE, SPEED);
  eventEmitter.fire('move:right-arm:lowered');
};

const lowerLeftArm = (servo) => {
  servo.to(LEFT_ARM_MIN_ANGLE, SPEED);
  eventEmitter.fire('move:left-arm:lowered');
};

const liftBothArms = (leftServo, rightServo) => {
  leftServo.to(LEFT_ARM_MAX_ANGLE, SPEED);
  rightServo.to(RIGHT_ARM_MAX_ANGLE, SPEED);
  eventEmitter.fire('move:both-arms:lifted');
};

const lowerBothArms = (leftServo, rightServo) => {
  leftServo.to(LEFT_ARM_MIN_ANGLE, SPEED);
  rightServo.to(RIGHT_ARM_MIN_ANGLE, SPEED);
  eventEmitter.fire('move:both-arms:lowered');
};

const turnHeadToCenter = (stepper) => {
  let steps = 0;
  let direction = CW_STEP_DIR;

  if (currentAngle < 0) {
    steps = -currentAngle;
    direction = CW_STEP_DIR;
  }
  else if (currentAngle > 0) {
    steps = currentAngle;
    direction = CCW_STEP_DIR;
  }
  else {
    eventEmitter.fire('move:head:centered');
    return;
  }

  stepper.speed(STEPPER_SPEED).step({ steps, direction }, () => {
    currentAngle = 0;
    eventEmitter.fire('move:head:centered');
  });
};

const turnHeadLeft = (stepper) => {
  let steps = 0;
  let direction = CW_STEP_DIR;

  if (currentAngle === -AMPLITUDE) {
    eventEmitter.fire('move:head:left');
    return;
  }
  else if (currentAngle < 0 && currentAngle > -AMPLITUDE) {
    steps = AMPLITUDE + currentAngle;
    direction = CCW_STEP_DIR;
  }
  else if (currentAngle < 0 && currentAngle < -AMPLITUDE) {
    steps = -currentAngle - AMPLITUDE;
    direction = CW_STEP_DIR;
  }
  else if (currentAngle > 0) {
    steps = currentAngle + AMPLITUDE;
    direction = CCW_STEP_DIR;
  }
  else if (currentAngle === 0) {
    steps = AMPLITUDE;
    direction = CCW_STEP_DIR;
  }

  stepper.speed(STEPPER_SPEED).step({ steps, direction }, () => {
    currentAngle = 0;
    eventEmitter.fire('move:head:left');
  });
};

const turnHeadRight = (stepper) => {
  let steps = 0;
  let direction = CW_STEP_DIR;

  if (currentAngle === AMPLITUDE) {
    eventEmitter.fire('move:head:right');
    return;
  }
  else if (currentAngle < 0) {
    steps = -currentAngle + AMPLITUDE;
    direction = CW_STEP_DIR;
  }
  else if (currentAngle > 0 && currentAngle < AMPLITUDE) {
    steps = AMPLITUDE - currentAngle;
    direction = CW_STEP_DIR;
  }
  else if (currentAngle > 0 && currentAngle > AMPLITUDE) {
    steps = currentAngle - AMPLITUDE;
    direction = CCW_STEP_DIR;
  }

  stepper.speed(STEPPER_SPEED).step({ steps, direction }, () => {
    currentAngle = 0;
    eventEmitter.fire('move:head:right');
  });
};

const turnAround = (stepper) => {};

const resetTurnAround = (stepper) => {};

const sweep = (stepper) => {
  let isFinishing = false;
  const goLeft = () => {
    stepper.speed(STEPPER_SWEEP_SPEED).speed({
      steps: STEPPER_SWEEP_AMPLITUDE,
      direction: CW_STEP_DIR,
      accel: 10,
      deccel: 10
    }, () => {
      if (isFinishing) {
        turnHeadToCenter(stepper);
        return;
      }
      eventEmitter.fire('head:local:left');
    });
  };
  const goRight = () => {
    stepper.speed(STEPPER_SWEEP_SPEED).speed({
      steps: STEPPER_SWEEP_AMPLITUDE,
      direction: CCW_STEP_DIR,
      accel: 10,
      deccel: 10
    }, () => {
      if (isFinishing) {
        turnHeadToCenter(stepper);
        return;
      }
      eventEmitter.fire('head:local:right');
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

module.exports = (_eventEmitter) => {
  eventEmitter = _eventEmitter;

  return {

  };
};
