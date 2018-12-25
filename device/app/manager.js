let eventEmitter;
const movePatterns = require('./move-patterns.js');
let moves;

let speakFile;
let tech;
let ftp;

let sonic = null;
let servo1 = null;
let servo2 = null;

let isMouthStrobe = false;
let areEyesShine = false;

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

  if (isMouthStrobe) {
      eventEmitter.emit('tech:turn-off:mouth');
      isMouthStrobe = false;
  }
  if (areEyesShine) {
      eventEmitter.emit('tech:turn-off:eyes');
      areEyesShine = false;
  }

console.log('patrolling');

  let isSmbdDetected = false;
  const smbdDetected = () => {
    if (isSmbdDetected) return;
    isSmbdDetected = true;
    eventEmitter.off('tech:sonic:crossed', smbdDetected);
    eventEmitter.off('main:command', smbdDetected);

    let onTotalEnd = () => {
      eventEmitter.emit('manager:patrol:finished');
      eventEmitter.off('speakFile:play:totalend:file', onTotalEnd);
      onTotalEnd = null;
    };
    speak();
    eventEmitter.on('speakFile:play:totalend:file', onTotalEnd);
  };

  eventEmitter.on('main:command', smbdDetected);
  eventEmitter.on('tech:sonic:crossed', smbdDetected);

  // moves.lowerBothArms(servo1, servo2);
}

function singAndDance() {
  if (servo1 === null || servo2 === null || sonic === null) return;
  let isPaused = false;

console.log('singNDance');
  let finishSweepingArms;

  let isSmbdDetected = false;
  const startMoving = () => {
    console.log('startMoving');
    isSmbdDetected = false;
    finishSweepingArms = moves.sweepArms(servo1, servo2);

    if (isPaused) {
      eventEmitter.emit('speakFile:song:resume');
      eventEmitter.off('speakFile:song:paused', speak);
    }

    if (isMouthStrobe) {
      eventEmitter.emit('tech:turn-off:mouth');
      isMouthStrobe = false;
    }

    if (areEyesShine) {
        eventEmitter.emit('tech:turn-off:eyes');
        areEyesShine = false;
    }
  };

  const smbdDetected = () => {
    if (isSmbdDetected) return;
    console.log('smbdDetected');
    isPaused = true;
    isSmbdDetected = true;
    finishSweepingArms();

    eventEmitter.emit('speakFile:song:pause');
    eventEmitter.on('speakFile:song:paused', speak);
  };

  const onSongEnded = () => {
    eventEmitter.off('speakFile:play:totalend:file', startMoving);
    eventEmitter.off('speakFile:song:end', onSongEnded);
    eventEmitter.off('main:command', smbdDetected);
    eventEmitter.off('tech:sonic:crossed', smbdDetected);
    finishSweepingArms();
    eventEmitter.emit('manager:singNDance:finished');
  };

  eventEmitter.on('main:command', smbdDetected);
  eventEmitter.on('tech:sonic:crossed', smbdDetected);
  eventEmitter.on('speakFile:song:end', onSongEnded);
  eventEmitter.on('speakFile:play:totalend:file', startMoving);
  startMoving();
  eventEmitter.emit('speakFile:song:play');
}

function speak() {
  if (servo1 === null || servo2 === null) return;

  if (isTimeForDemon()) {
      demon();
      return;
  }

  console.log('start speaking');

  const random2 = getRandom2();
  const random3 = getRandom3();
  const onGreetingPlayed = () => {
    console.log('greeting played');
    // moves.lowerBothArms(servo1, servo2);
    const label = random2 === 1 ? 'wishes' : 'predictions';
    eventEmitter.emit('play', { label });
    eventEmitter.off('speakFile:greet:end', onGreetingPlayed);
  };

  eventEmitter.on('speakFile:greet:end', onGreetingPlayed);
  eventEmitter.emit('speakFile:greet:play');
  eventEmitter.emit('tech:strobe-mouth');
  isMouthStrobe = true;

    const move = random2 === 1 ? 'liftRightArm' : 'liftLeftArm';
    const servos = random2 === 1 ? [servo2] : [servo1];
    moves[move](...servos);
}

function demon() {
    if (servo1 === null || servo2 === null) return;

    console.log('start demon');

    const random2 = getRandom2();
    const onGreetingPlayed = () => {
        console.log('greeting played');
        // moves.lowerBothArms(servo1, servo2);
        eventEmitter.emit('play', { label: 'demon' });
        eventEmitter.off('speakFile:greet:end', onGreetingPlayed);
    };

    eventEmitter.on('speakFile:greet:end', onGreetingPlayed);
    eventEmitter.emit('speakFile:demon-greet:play');
    eventEmitter.emit('tech:turn-on:eyes');
    eventEmitter.emit('tech:strobe-mouth');
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
    eventEmitter.on('tech:servo1:ready', (_servo1) => { servo1 = _servo1 });
    eventEmitter.on('tech:servo2:ready', (_servo2) => { servo2 = _servo2 });

    eventEmitter.on('manager:patrol:finished', singAndDance);
    eventEmitter.on('manager:singNDance:finished', patrol);

    const init = () => {
      if (sonic === null && servo1 === null && servo2 === null) return;
      eventEmitter.off('manager:init', init);
      singAndDance();
    };

    eventEmitter.on('tech:sonic:ready', init);
    eventEmitter.on('tech:servo1:ready', init);
    eventEmitter.on('tech:servo2:ready', init);

};
