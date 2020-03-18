import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

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
import { RETRO_STATUS } from '../../utils/constants.js';

import retroBotInsetLogo from '../../assets/logo-dropshadow.png';

class SideMenu extends React.Component {
  static propTypes = {
    compact: PropTypes.bool.isRequired,
    creator: PropTypes.bool.isRequired,
    state: PropTypes.oneOf(['in_progress', 'voting', 'locked']).isRequired,
    timer: PropTypes.shape({
      show: PropTypes.bool.isRequired,
    }).isRequired,
    timeLimitMinutes: PropTypes.number.isRequired,
    userCount: PropTypes.number.isRequired,
    voteCount: PropTypes.number.isRequired,
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
      <div className={classNames(
        'sidebar-menu',
        {
          'sidebar-menu--compact': this.props.compact,
        },
      )}>
        <div className="sidebar-menu--title">
          <Link to="/">
            <img
              src={retroBotInsetLogo}
            />
          </Link>
        </div>

        {this.props.creator && this.renderCreatorInfo()}

        {!this.props.timer.show && this.props.creator && this.props.state === RETRO_STATUS.IN_PROGRESS && (
          <div className="sidebar-menu--group">
            <button className="btn btn-primary" onClick={this.handleStartTimer}>
              <i className="fa fa-clock-o" aria-hidden="true" />
              {!this.props.compact && 'Start timer'}
            </button>
          </div>
        )}

        {this.props.state === RETRO_STATUS.VOTING && this.props.creator && (
          <div className="sidebar-menu--group">
            <button className="btn btn-dark js-test-lock" onClick={this.handleLock}>
              <i className="fa fa-lock" aria-hidden="true" />
              {!this.props.compact && 'Lock Retro'}
            </button>
          </div>
        )}
        {this.props.state === RETRO_STATUS.LOCKED && this.props.creator && (
          <div className="sidebar-menu--group">
            <button className="btn btn-dark" onClick={this.handleUnlock}>
              <i className="fa fa-unlock" aria-hidden="true" />
              {!this.props.compact && 'Unlock Retro'}
            </button>
          </div>
        )}
        {this.props.state === RETRO_STATUS.LOCKED && (
          <div className="sidebar-menu--group">
            <button className="btn btn-dark" onClick={this.handleSortDeltas}>
              <i className="fa fa-sort-amount-desc" aria-hidden="true" />
              {!this.props.compact && 'Sort Deltas'}
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default SideMenu;