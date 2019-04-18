let eventEmitter;
const movePatterns = require('./move-patterns.js');
let moves;

const {
  EYES_ON,
  MOUTH_ON,
  EYES_OFF,
  MOUTH_OFF,
  SERVO_L_READY,
  SERVO_R_READY,
  SONIC_CROSSED,
  FINISH_PATROL,
  TOTAL_END_AUDIO,
  USER_COMMAND
} = require('./constants.js');

let speakFile;
let tech;
let ftp;

let sonic = null;
let servo1 = null;
let servo2 = null;

let isMouthStrobe = false;
let areEyesShine = false;

let isSingAndDance = false;

let prevHour = null;
const isTimeForDemon = () => {
    const hour = (new Date()).getHours();
    const isEqToPrevHour = hour === prevHour;
    const isEven = hour % 2 === 0;

    if (isEqToPrevHour) {
        return false;
    } else {
        if (isEven) {
            prevHour = hour;
            return true;
        } else {
            return false;
        }
    }
};

const getRandom3 = () => {
  const random = Math.ceil(Math.random() * 13);
  return random % 3 === 0 ? 2 :
    random % 2 === 0 ? 1 : 0;
};

const getRandom2 = () => {
    const random = Math.ceil(Math.random() * 13);
    return random % 2 === 0 ? 1 : 0;
};

function patrol() {
  if (sonic === null) return;
  isSingAndDance = false;

  eventEmitter.emit(MOUTH_OFF);
  eventEmitter.emit(EYES_OFF);

  let isSmbdDetected = false;
  const smbdDetected = (label) => {
    if (isSmbdDetected) return;
    isSmbdDetected = true;
    eventEmitter.off(SONIC_CROSSED, smbdDetected);
    eventEmitter.off(USER_COMMAND, smbdDetected);

    let onTotalEnd = () => {
      eventEmitter.emit(FINISH_PATROL);
      eventEmitter.off(TOTAL_END_AUDIO, onTotalEnd);
      onTotalEnd = null;
    };
    speak(label);
    eventEmitter.on(TOTAL_END_AUDIO, onTotalEnd);
  };

  eventEmitter.on(USER_COMMAND, smbdDetected);
  eventEmitter.on(SONIC_CROSSED, smbdDetected);
}

function singAndDance() {
  if (isSingAndDance || servo1 === null || servo2 === null || sonic === null) return;
  isSingAndDance = true;
  let isPaused = false;

  let finishSweepingArms;
  let gotLabel;

  let isSmbdDetected = false;
  let startAt = 0;
  const startMoving = () => {
    isSmbdDetected = false;
    startAt = null;
    finishSweepingArms = moves.sweepArms(servo1, servo2);

    if (isPaused) {
      eventEmitter.emit('speakFile:song:resume');
      isPaused = false;
      eventEmitter.off('speakFile:song:paused', onSongPaused);
    }

    eventEmitter.emit(MOUTH_OFF);
    eventEmitter.emit(EYES_OFF);
  };

  const onSongPaused = () => {
    eventEmitter.off('speakFile:song:paused', onSongPaused);
    speak(gotLabel);
  };

  const smbdDetected = (label) => {
    gotLabel = label;
    if (isSmbdDetected) return;
    startAt = Date.now();
    isSmbdDetected = true;
    isPaused = true;
    if (finishSweepingArms instanceof Function) {
      finishSweepingArms();
    }

    eventEmitter.emit('speakFile:song:pause');
    eventEmitter.on('speakFile:song:paused', onSongPaused);
  };

  const onMainCommand = (label) => {
    if (isPaused) {
      const diff = Date.now() - startAt;
      if (diff < 10000) {
        setTimeout(() => {
          eventEmitter.emit('play', { label });
        }, 7000);
      }
      if (diff > 10000) {
        eventEmitter.emit('play', { label });
      }
    } else {
      smbdDetected(label);
    }
  };

  const onSongEnded = () => {
    eventEmitter.off('speakFile:play:totalend:file', startMoving);
    eventEmitter.off('speakFile:song:end', onSongEnded);
    eventEmitter.off(USER_COMMAND, smbdDetected);
    eventEmitter.off(SONIC_CROSSED, smbdDetected);
    eventEmitter.off(USER_COMMAND, onMainCommand);
    if (finishSweepingArms instanceof Function) {
      finishSweepingArms();
    }
    eventEmitter.emit('manager:singNDance:finished');
  };

  eventEmitter.on(USER_COMMAND, onMainCommand);
  eventEmitter.on(SONIC_CROSSED, smbdDetected);
  eventEmitter.on('speakFile:song:end', onSongEnded);
  eventEmitter.on('speakFile:play:totalend:file', startMoving);
  startMoving();
  eventEmitter.emit('speakFile:song:play');
}

function speak(_label) {
  if (servo1 === null || servo2 === null) return;

  if (_label === undefined && isTimeForDemon()) {
      demon();
      return;
  }

  const random2 = getRandom2();
  const random3 = getRandom3();
  const onGreetingPlayed = () => {
    const label = _label !== undefined ? _label : (random2 === 1 ? 'wishes' : 'predictions');
    eventEmitter.emit('play', { label });
    eventEmitter.off('speakFile:greet:end', onGreetingPlayed);
  };

  eventEmitter.on('speakFile:greet:end', onGreetingPlayed);
  eventEmitter.emit('speakFile:greet:play');
  eventEmitter.emit(MOUTH_ON);
  isMouthStrobe = true;

    const move = random2 === 1 ? 'liftRightArm' : 'liftLeftArm';
    const servos = random2 === 1 ? [servo2] : [servo1];
    moves[move](...servos);
}

function demon() {
    if (servo1 === null || servo2 === null) return;

    const random2 = getRandom2();
    const onGreetingPlayed = () => {
        eventEmitter.emit('play', { label: 'demon' });
        eventEmitter.off('speakFile:greet:end', onGreetingPlayed);
    };

    eventEmitter.on('speakFile:greet:end', onGreetingPlayed);
    eventEmitter.emit('speakFile:demon-greet:play');
    eventEmitter.emit(EYES_ON);
    eventEmitter.emit(MOUTH_ON);
    isMouthStrobe = true;
    areEyesShine = true;

    const move = random2 === 1 ? 'liftRightArm' : 'liftLeftArm';
    const servos = random2 === 1 ? [servo2] : [servo1];
    moves[move](...servos);
}

module.exports = (_eventEmitter) => {
    eventEmitter = _eventEmitter;
    moves = movePatterns(eventEmitter);
    speakFile = require('./speakFile')(eventEmitter);
    tech = require('./tech')(eventEmitter);
    ftp = require('./ftp-client')(eventEmitter);

    eventEmitter.on('tech:sonic:ready', (_sonic) => { sonic = _sonic });
    eventEmitter.on(SERVO_L_READY, (_servo1) => { servo1 = _servo1 });
    eventEmitter.on(SERVO_R_READY, (_servo2) => { servo2 = _servo2 });

    eventEmitter.on(FINISH_PATROL, singAndDance);
    eventEmitter.on('manager:singNDance:finished', patrol);

    const init = () => {
      if (sonic === null && servo1 === null && servo2 === null) return;
      eventEmitter.off('manager:init', init);
      singAndDance();
    };

    eventEmitter.on('tech:sonic:ready', init);
    eventEmitter.on(SERVO_L_READY, init);
    eventEmitter.on(SERVO_R_READY, init);

};
