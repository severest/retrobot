import React from 'react';
import PropTypes from 'prop-types';
import copy from 'copy-to-clipboard';

import SideMenu from './SideMenu.jsx';

import {
  lockRetro,
  unlockRetro,
} from '../../ws/index.js';
import {
  startTimer,
} from '../../utils/timer.js';
import {
  sortDeltas,
} from '../../flux/retro/actions.js';
import {
  addNotification,
} from '../../flux/notifications/actions.js';
import { RETRO_STATUS } from '../../utils/constants.js';

class RetroSideMenu extends React.Component {
  static propTypes = {
    creator: PropTypes.bool.isRequired,
    includeTemperatureCheck: PropTypes.bool.isRequired,
    retroKey: PropTypes.string.isRequired,
    state: PropTypes.oneOf(['in_progress', 'voting', 'locked']).isRequired,
    timer: PropTypes.shape({
      show: PropTypes.bool.isRequired,
    }).isRequired,
    timeLimitMinutes: PropTypes.number.isRequired,
    userCount: PropTypes.number.isRequired,
    voteCount: PropTypes.number.isRequired,
    onCloseMenu: PropTypes.func.isRequired,
    onShowMyTempCheck: PropTypes.func.isRequired,
    onShowTempCheckSummary: PropTypes.func.isRequired,
  }

  handleStartTimer = () => {
    startTimer(this.props.timeLimitMinutes);
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

  handleCopyRetroKeyToClipboard = () => {
    copy(window.location.href);
    addNotification({
      message: 'Retro URL copied to clipboard!',
      dismissAfter: 3000,
    });
  }

  renderCreatorInfo() {
    return (
      <div className="sidebar-menu--group">
        <div className="sidebar-menu--group-item admin-star">
          <i className="fa fa-star" aria-hidden="true" /> You are the admin
        </div>
        {this.props.state !== RETRO_STATUS.LOCKED && (
          <React.Fragment>
            <div className="sidebar-menu--group-item">
              <i className="fa fa-plus-circle" aria-hidden="true" /> {this.props.voteCount} votes submitted
            </div>
            <div className="sidebar-menu--group-item">
              <i className="fa fa-user" aria-hidden="true" /> {this.props.userCount} users online
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }

  render() {
    return (
      <SideMenu
        onCloseMenu={this.props.onCloseMenu}
      >
        <div className="sidebar-menu--group sidebar-menu--retrokey">
          {this.props.retroKey}
          <button
            className="btn btn-dark"
            onClick={this.handleCopyRetroKeyToClipboard}
            aria-label="Copy to clipboard"
          >
            <i className="fa fa-clipboard" aria-hidden="true" />
          </button>
        </div>

        {this.props.includeTemperatureCheck && (
          <div className="sidebar-menu--group">
            <button
              className="btn btn-dark"
              onClick={this.props.onShowMyTempCheck}
              disabled={this.props.state === RETRO_STATUS.LOCKED}
            >
              <i className="fa fa-thermometer-empty" aria-hidden="true" />
              My temp check
            </button>
          </div>
        )}

        {this.props.creator && this.renderCreatorInfo()}

        {!this.props.timer.show && this.props.creator && this.props.state === RETRO_STATUS.IN_PROGRESS && (
          <div className="sidebar-menu--group">
            <button className="btn btn-primary" onClick={this.handleStartTimer}>
              <i className="fa fa-clock-o" aria-hidden="true" />
              Start timer
            </button>
          </div>
        )}

        {this.props.includeTemperatureCheck && (
          <div className="sidebar-menu--group">
            <button className="btn btn-primary" onClick={this.props.onShowTempCheckSummary}>
              <i className="fa fa-thermometer-empty" aria-hidden="true" />
              Temp checks
            </button>
          </div>
        )}

        {this.props.state === RETRO_STATUS.VOTING && this.props.creator && (
          <div className="sidebar-menu--group">
            <button className="btn btn-dark js-test-lock" onClick={this.handleLock}>
              <i className="fa fa-lock" aria-hidden="true" />
              Lock Retro
            </button>
          </div>
        )}
        {this.props.state === RETRO_STATUS.LOCKED && this.props.creator && (
          <div className="sidebar-menu--group">
            <button className="btn btn-dark" onClick={this.handleUnlock}>
              <i className="fa fa-unlock" aria-hidden="true" />
              Unlock Retro
            </button>
          </div>
        )}
        {this.props.state === RETRO_STATUS.LOCKED && (
          <div className="sidebar-menu--group">
            <button className="btn btn-dark" onClick={this.handleSortDeltas}>
              <i className="fa fa-sort-amount-desc" aria-hidden="true" />
              Sort Deltas
            </button>
          </div>
        )}
      </SideMenu>
    );
  }
}

export default RetroSideMenu;
