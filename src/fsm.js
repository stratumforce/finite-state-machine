class FSM {
  /**
   * Creates new FSM instance.
   * @param config
   */
  constructor(config) {
    if (!config) throw new Error("No config");

    this.config = config;
    this.state = this.config.initial;
    this.history = [this.state];
    this.history_position = 0;
  }

  /**
   * Returns active state.
   * @returns {String}
   */
  getState() {
    return this.state;
  }

  /**
   * Goes to specified state.
   * @param state
   */
  changeState(state) {
    if (!this.config.states[state]) throw new Error("No such state");

    this.state = state;

    if (this.history_position !== this.history.length - 1) {
      this.history = this.history.slice(0, this.history_position + 1);
      this.history_position = this.history.length - 1;
    }

    this.history.push(this.state);
    this.history_position++;

    return this.state;
  }

  /**
   * Changes state according to event transition rules.
   * @param event
   */
  trigger(event) {
    if (!this.config.states[this.state].transitions[event])
      throw new Error("No such state");

    return this.changeState(this.config.states[this.state].transitions[event]);
  }

  /**
   * Resets FSM state to initial.
   */
  reset() {
    this.state = this.config.initial;
    this.history.push(this.state);
    this.history_position++;

    return this.state;
  }

  /**
   * Returns an array of states for which there are specified event transition rules.
   * Returns all states if argument is undefined.
   * @param event
   * @returns {Array}
   */
  getStates(event) {
    if (!event) return Object.keys(this.config.states);

    return Object.keys(this.config.states).filter(
      state => this.config.states[state].transitions[event]
    );
  }

  /**
   * Goes back to previous state.
   * Returns false if undo is not available.
   * @returns {Boolean}
   */
  undo() {
    if (this.history.length <= 1 || this.history_position === 0) return false;

    this.history_position--;
    this.state = this.history[this.history_position];

    return true;
  }

  /**
   * Goes redo to state.
   * Returns false if redo is not available.
   * @returns {Boolean}
   */
  redo() {
    if (
      this.history.length <= 1 ||
      this.history_position === this.history.length - 1
    )
      return false;

    this.history_position++;
    this.state = this.history[this.history_position];

    return true;
  }

  /**
   * Clears transition history
   */
  clearHistory() {
    this.state = this.config.initial;
    this.history = [];
    this.history_position = 0;
  }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
