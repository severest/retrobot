import React from 'react';
import PropTypes from 'prop-types';

import {
  sendPlus,
  sendDelta,
} from './ws/index.js';
import {
  startTimer,
} from './timer.js';

class ControlPanel extends React.Component {
  static propTypes = {
    timer: PropTypes.shape({
      show: PropTypes.bool.isRequired,
      minutes: PropTypes.number.isRequired,
      seconds: PropTypes.number.isRequired,
    }).isRequired,
  }

  handleSendPlus = () => {
    if ($(this.inputBox).val().trim() === '') return;
    sendPlus($(this.inputBox).val().trim(), window.myID);
    $(this.inputBox).val('');
  }

  handleSendDelta = () => {
    if ($(this.inputBox).val().trim() === '') return;
    sendDelta($(this.inputBox).val().trim(), window.myID);
    $(this.inputBox).val('');
  }

  handleStartTimer = () => {
    startTimer();
  }

  handleInputKeyPress = (evt) => {
    if (evt.key === 'Enter') {
      if (evt.shiftKey) {
        this.handleSendDelta();
      } else {
        this.handleSendPlus();
      }
    }
  }

  render() {
    return (
      <div className="control-panel">
        <div>
          Retrobot
        </div>
        {this.props.timer.show ? (
          <div className="timer">{`${this.props.timer.minutes}:${this.props.timer.seconds < 10 ? '0' + this.props.timer.seconds : this.props.timer.seconds}`}</div>
        ) : (
          <div className="start-timer">
            <button className="btn btn-primary" onClick={this.handleStartTimer}>Start timer</button>
          </div>
        )}
        <div className="input-group create-items">
          <input
            type="text"
            ref={c => this.inputBox = c}
            className="form-control"
            onKeyPress={this.handleInputKeyPress}
          />
          <span className="input-group-btn">
            <button
              className="btn btn-default"
              type="button"
              onClick={this.handleSendPlus}
            >
              Plus
            </button>
            <button
              className="btn btn-default"
              type="button"
              onClick={this.handleSendDelta}
            >
              Delta
            </button>
          </span>
        </div>
      </div>
    );
  }
}

export default ControlPanel;
