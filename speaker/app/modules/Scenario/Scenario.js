/**
 * Scenario composes behaviors
 */
class Scenario {
  constructor() {
    this.activeBehavior = null;
    this.behaviors = [];
    this.isBehaviorPaused = false;
    this.isLooped = true;
  }

  start() {}

  pause() {}

  finish() {}
}


export default Scenario;
