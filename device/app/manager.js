let eventEmitter;
const movePatterns = require('./move-patterns.js');
let moves;

let speakFile;
let tech;
let ftp;

let stepper = null;
let sonic = null;
let servo1 = null;
let servo2 = null;

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
  if (stepper === null || sonic === null) return;
console.log('patrolling');
  let prevPosition = 0;
  let position = 0;

  const onLeftFinished = () => {
    prevPosition = position;
    position = -1;
    moves.turnHeadToCenter(stepper);
  };
  const onRightFinished = () => {
    prevPosition = position;
    position = 1;
    moves.turnHeadToCenter(stepper);
  };
  const onCenterFinished = () => {
    if (position === -1) {
      moves.turnHeadRight(stepper);
    } else if (position === 1) {
      moves.turnHeadLeft(stepper);
    }
    prevPosition = position;
    position = 0;
  };

  eventEmitter.on('move:head:left', onLeftFinished);
  eventEmitter.on('move:head:right', onRightFinished);
  eventEmitter.on('move:head:centered', onCenterFinished);

  let isSmbdDetected = false;
  const smbdDetected = () => {
    if (isSmbdDetected) return;
    isSmbdDetected = true;
    eventEmitter.off('tech:sonic:crossed', smbdDetected);
    eventEmitter.off('main:command', smbdDetected);
    eventEmitter.off('move:head:left', onLeftFinished);
    eventEmitter.off('move:head:right', onRightFinished);
    eventEmitter.off('move:head:centered', onCenterFinished);
    eventEmitter.off('tech:sonic:crossed', smbdDetected);

    const onDetected = () => {
      console.log('detected');
      moves.turnHeadToCenter(stepper);
      if (prevPosition === -1) {
        eventEmitter.off('move:head:right', onDetected);
      } else if (prevPosition === 1) {
        eventEmitter.off('move:head:left', onDetected);
      }
    };

    if (prevPosition === -1) {
      eventEmitter.on('move:head:right', onDetected);
    } else if (prevPosition === 1) {
      eventEmitter.on('move:head:left', onDetected);
    }

    const onTotalEnd = () => {
      eventEmitter.emit('manager:patrol:finished');
      eventEmitter.off('speakFile:play:totalend:file', onTotalEnd);
      eventEmitter.off('speakFile:song:paused', speak);
    };

    eventEmitter.on('speakFile:play:totalend:file', onTotalEnd);
  };

  eventEmitter.on('main:command', smbdDetected);
  eventEmitter.on('tech:sonic:crossed', smbdDetected);

  moves.turnHeadLeft(stepper);
  moves.lowerBothArms(servo1, servo2);
}

function singAndDance() {
  if (stepper === null || servo1 === null || servo2 === null) return;
  let isPaused = false;

console.log('singNDance');
  let finishSweepingHead;
  let finishSweepingArms;

  let isSmbdDetected = false;
  const startMoving = () => {
    console.log('startMoving');
    isSmbdDetected = false;
    finishSweepingHead = moves.sweepHead(stepper);
    finishSweepingArms = moves.sweepArms(servo1, servo2);

    if (isPaused) {
      eventEmitter.emit('speakFile:song:resume');
      eventEmitter.off('speakFile:song:paused', speak);
    }
  };

  const smbdDetected = () => {
    if (isSmbdDetected) return;
    console.log('smbdDetected');
    isPaused = true;
    isSmbdDetected = true;
    finishSweepingArms();
    finishSweepingHead();

    eventEmitter.emit('speakFile:song:pause');
    eventEmitter.on('speakFile:song:paused', speak);
  };

  const onSongEnded = () => {
    finishSweepingArms();
    finishSweepingHead();
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
  if (stepper === null || servo1 === null || servo2 === null) return;

  console.log('start speaking');

  const random3 = getRandom3();
  const onGreetingPlayed = () => {
    console.log('greeting played');
    moves.lowerBothArms(servo1, servo2);
    const label = random3 === 2 ? 'phrases.jokes' :
      random3 === 1 ? 'wishes' : 'predictions';
    eventEmitter.emit('play', { label: 'wishes' });
    eventEmitter.off('speakFile:greet:end', onGreetingPlayed);
  };

  eventEmitter.on('speakFile:greet:end', onGreetingPlayed);
  eventEmitter.emit('speakFile:greet:play');

  const move = random3 === 2 ? 'liftBothArms' : random3 === 1 ? 'liftRightArm' : 'liftLeftArm';
  const servos = random3 === 2 ? [servo1, servo2] : random3 === 1 ? [servo2] : [servo1];
  moves[move](...servos);
}

function demon() {
  if (stepper === null || servo1 === null || servo2 === null) return;


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
    eventEmitter.on('tech:stepper:ready', (_stepper) => { stepper = _stepper });

    eventEmitter.on('manager:patrol:finished', singAndDance);
    eventEmitter.on('manager:singNDance:finished', patrol);

    const init = () => {
      if (stepper === null && sonic === null && servo1 === null && servo2 === null) return;
      eventEmitter.off('manager:init', init);
      singAndDance();
    };

    eventEmitter.on('tech:sonic:ready', init);
    eventEmitter.on('tech:servo1:ready', init);
    eventEmitter.on('tech:servo2:ready', init);
    eventEmitter.on('tech:stepper:ready', init);

};
