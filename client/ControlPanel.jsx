import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'rc-tooltip';
import { Link } from 'react-router-dom';

import {
  sendPlus,
  sendDelta,
  lockRetro,
  unlockRetro,
} from './ws/index.js';
import {
  startTimer,
} from './timer.js';
import {
  sortDeltas,
} from './flux/actions.js';
import { RETRO_STATUS } from './utils/constants.js';

class ControlPanel extends React.Component {
  static propTypes = {
    creator: PropTypes.bool.isRequired,
    state: PropTypes.oneOf(['in_progress', 'voting', 'locked']).isRequired,
    timer: PropTypes.shape({
      show: PropTypes.bool.isRequired,
      minutes: PropTypes.number.isRequired,
      seconds: PropTypes.number.isRequired,
    }).isRequired,
    userCount: PropTypes.number.isRequired,
    voteCount: PropTypes.number.isRequired,
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

  handleSortDeltas = () => {
    sortDeltas();
  }

  handleLock = () => {
    lockRetro();
  }

  handleUnlock = () => {
    unlockRetro();
  }

  renderStar() {
    return (
      <div className="admin-star">
        <Tooltip
          placement="top"
          overlay="You are the admin"
        >
          <i className="fa fa-star" aria-hidden="true"></i>
        </Tooltip>
      </div>
    );
  }

  renderControls() {
    return (
      <div className="actions">
        {this.props.timer.show && (
          <div className="timer js-test-timer">{`${this.props.timer.minutes}:${this.props.timer.seconds < 10 ? '0' + this.props.timer.seconds : this.props.timer.seconds}`}</div>
        )}
        {!this.props.timer.show && this.props.creator && this.props.state === RETRO_STATUS.IN_PROGRESS && (
          <div className="start-timer">
            <button className="btn btn-primary" onClick={this.handleStartTimer}>Start timer</button>
          </div>
        )}
        <div className="btn-group" role="group">
          {this.props.state === RETRO_STATUS.VOTING && this.props.creator && (
            <button className="btn btn-default js-test-lock" onClick={this.handleLock}>
              <i className="fa fa-lock" aria-hidden="true"></i>
            </button>
          )}
          {this.props.state === RETRO_STATUS.LOCKED && this.props.creator && (
            <button className="btn btn-default" onClick={this.handleUnlock}>
              <i className="fa fa-unlock" aria-hidden="true"></i>
            </button>
          )}
          {this.props.state === RETRO_STATUS.LOCKED && (
            <button className="btn btn-default" onClick={this.handleSortDeltas}>
              <i className="fa fa-sort-amount-desc" aria-hidden="true"></i>
            </button>
          )}
        </div>
        {this.props.state !== RETRO_STATUS.LOCKED && this.props.creator && (
          <div className="vote-tally">
            <Tooltip
              placement="top"
              overlay="Number of votes submitted"
            >
              <span>
                {this.props.voteCount} <i className="fa fa-plus-circle" aria-hidden="true"></i>
              </span>
            </Tooltip>
            {' / '}
            <Tooltip
              placement="top"
              overlay="Users in the retro"
            >
              <span>
                {this.props.userCount} <i className="fa fa-user" aria-hidden="true"></i>
              </span>
            </Tooltip>
          </div>
        )}
      </div>
    );
  }

  renderInput() {
    return (
      <div className="inputs">
        <div className="input-group create-items">
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
        <div>Enter: <i className="fa fa-plus" aria-hidden="true"></i>, ShiftEnter: <i className="fa fa-exclamation-triangle" aria-hidden="true"></i></div>
      </div>
    );
  }

  render() {
    return (
      <div className="control-panel">
        <div className="title">
          <Link to="/">Retrobot</Link>
          {this.props.creator && this.renderStar()}
        </div>
        {this.renderControls()}
        {this.renderInput()}
      </div>
    );
  }
}

export default ControlPanel;
