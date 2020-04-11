import React from 'react';
import PropTypes from 'prop-types';

import {
  sendPlus,
  sendDelta,
} from '../../ws/index.js';
import { RETRO_STATUS } from '../../utils/constants.js';

class RetroInput extends React.Component {
  static propTypes = {
    state: PropTypes.oneOf(['in_progress', 'voting', 'locked']).isRequired,
  }

  handleSendPlus = () => {
    if (this.inputBox.value.trim() === '') return;
    sendPlus(this.inputBox.value.trim(), window.myID);
    this.inputBox.value = '';
  }

  handleSendDelta = () => {
    if (this.inputBox.value.trim() === '') return;
    sendDelta(this.inputBox.value.trim(), window.myID);
    this.inputBox.value = '';
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
        <div className="inputs">
          <div className="input-group">
            <input
              type="text"
              ref={c => this.inputBox = c}
              className="form-control"
              onKeyPress={this.handleInputKeyPress}
              disabled={this.props.state === RETRO_STATUS.LOCKED}
            />
            <span className="input-group-btn">
              <button
                className="btn btn-default"
                type="button"
                onClick={this.handleSendPlus}
                disabled={this.props.state === RETRO_STATUS.LOCKED}
              >
                Plus
              </button>
              <button
                className="btn btn-default js-test-send-delta-btn"
                type="button"
                onClick={this.handleSendDelta}
                disabled={this.props.state === RETRO_STATUS.LOCKED}
              >
                Delta
              </button>
            </span>
          </div>
          <div className="input-tip">Enter: <i className="fa fa-plus" aria-hidden="true" />&nbsp;&nbsp;&nbsp;Shift-Enter: <i className="fa fa-exclamation-triangle" aria-hidden="true" /></div>
        </div>
      </div>
    );
  }
}

export default RetroInput;
