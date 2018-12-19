let eventEmitter;
const movePatterns = require('./move-patterns.js');
let moves;

let speakFile;
let tech;
let ftp;

let devicesReady = 0;

let stepper = null;
let sonic = null;
let servo1 = null;
let servo2 = null;

function patrol() {
  // TODO добавить условие "кто-то приказал свиньюшке говорить"
  if (stepper === null || sonic === null) return;

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
    eventEmitter.off('move:head:left', onLeftFinished);
    eventEmitter.off('move:head:right', onRightFinished);
    eventEmitter.off('move:head:centered', onCenterFinished);
    eventEmitter.off('tech:sonic:crossed', smbdDetected);

    const onDetected = () => {
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

    speak();
  };

  eventEmitter.on('tech:sonic:crossed', smbdDetected);

  moves.turnHeadLeft(stepper);
}

function singAndDance() {
  // TODO добавить условие "кто-то приказал свиньюшке говорить"
  if (stepper === null || servo1 === null || servo2 === null) return;

  let finishSweepingHead = moves.sweepHead(stepper);
  let finishSweepingArms = moves.sweepArms(servo1, servo2);

  const startMoving = () => {
    finishSweepingHead = moves.sweepHead(stepper);
    finishSweepingArms = moves.sweepArms(servo1, servo2);
  };

  const smbdDetected = () => {
    finishSweepingArms();
    finishSweepingHead();

    eventEmitter.emit('speakFile:pause');

    speak();
  };

  const onSongEnded = () => {
    finishSweepingArms();
    finishSweepingHead();

    eventEmitter.emit('manager:singNdance:finished');
  };

  eventEmitter.on('tech:sonic:crossed', smbdDetected);
  eventEmitter.on('speakFile:play:end:song', onSongEnded);
  eventEmitter.on('speakFile:play:totalend:file', startMoving);
  startMoving();
}

function speak() {
  if (stepper === null || servo1 === null || servo2 === null) return;

  const onGreetingPlayed = () => {
    const label = Math.ceil(Math.random() * 13) % 2 === 0 ? 'wishes' : 'predictions';
    eventEmitter.emit('play', { label });
    eventEmitter.off('speakFile:play:end:greeting', onGreetingPlayed);
  };

  eventEmitter.on('speakFile:play:end:greeting', onGreetingPlayed);
  eventEmitter.emit('play', { label: 'greeting', isRemove: false });
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

    eventEmitter.on('tech:sonic:ready', (_sonic) => {
      sonic = _sonic;
    });
    eventEmitter.on('tech:servo1:ready', (_servo1) => {
      servo1 = _servo1;
    });
    eventEmitter.on('tech:servo2:ready', (_servo2) => {
      servo2 = _servo2;
    });
    eventEmitter.on('tech:stepper:ready', (_stepper) => {
      stepper = _stepper;
    });
    eventEmitter.on('speakFile: file played', patrol);
};
