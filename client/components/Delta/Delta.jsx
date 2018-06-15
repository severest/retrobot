import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
  sendUpVote,
  sendDownVote,
  deleteDelta,
} from '../../ws/index.js';
import {
  openNotesModal,
} from '../../flux/actions.js';
import { RETRO_STATUS } from '../../utils/constants.js';


class Delta extends React.Component {
  static propTypes = {
    content: PropTypes.string.isRequired,
    userId: PropTypes.string,
    id: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    maxVotes: PropTypes.number.isRequired,
    votes: PropTypes.arrayOf(PropTypes.string).isRequired,
    hide: PropTypes.bool,
    retroKey: PropTypes.string.isRequired,
    retroState: PropTypes.string.isRequired,
    showOpenNotesBtn: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    hide: false,
    userId: '',
  }

  state = {
    IVoted: false,
  }

  handleUpVote = () => {
    const key = `delta-${this.props.id}`;
    const voted = sessionStorage.getItem(key);
    const totalVotes = parseInt(sessionStorage.getItem(`totalVotes-${this.props.retroKey}`));
    if (totalVotes === this.props.maxVotes) {
      alert('You have reached your vote maximum');
      return;
    }

    sendUpVote('delta', this.props.id);
    if (voted === null) {
      sessionStorage.setItem(key, 1);
    } else {
      sessionStorage.setItem(key, parseInt(voted) + 1);
    }
    this.setState({ IVoted: true });
    sessionStorage.setItem(`totalVotes-${this.props.retroKey}`, totalVotes + 1);
  }

  handleDownVote = () => {
    const key = `delta-${this.props.id}`;
    let voted = sessionStorage.getItem(key);
    if (voted === null) {
      alert("You can't down vote something you haven't voted for yet");
      return;
    }

    sendDownVote('delta', this.props.id);
    voted = parseInt(voted);
    if ((voted - 1) === 0) {
      this.setState({ IVoted: false });
      sessionStorage.removeItem(key);
    } else {
      sessionStorage.setItem(key, voted - 1);
    }
    const totalVotes = parseInt(sessionStorage.getItem(`totalVotes-${this.props.retroKey}`));
    sessionStorage.setItem(`totalVotes-${this.props.retroKey}`, totalVotes - 1);
  }

  handleDelete = () => {
    const key = `delta-${this.props.id}`;
    let voted = sessionStorage.getItem(key);
    if (voted !== null) {
      voted = parseInt(voted);
      const totalVotes = parseInt(sessionStorage.getItem(`totalVotes-${this.props.retroKey}`));
      sessionStorage.setItem(`totalVotes-${this.props.retroKey}`, totalVotes - voted);
    }
    deleteDelta(this.props.id);
  }

  handleOpenNotes = () => openNotesModal(this.props.id)

  get topClass() {
    return classNames(
      'card',
      'delta-card',
      'js-test-delta',
    );
  }

  get voteClass() {
    return classNames(
      'card__votes',
    );
  }

  get upVoteClass() {
    return classNames(
      'btn',
      'btn-link',
      'upvote',
      {
        'mine': this.state.IVoted,
      },
    );
  }

  get deleteClass() {
    return classNames(
      'btn',
      'btn-link',
      'card__delete',
      {
        'hidden': window.myID !== this.props.userId,
      },
    );
  }

  render() {
    if (this.props.hide) return null;
    return (
      <div className={this.topClass}>
        <div className="card__left">
          <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
          {this.props.retroState === RETRO_STATUS.LOCKED && (
            <div className={this.voteClass}>
              {this.props.votes.length}
            </div>
          )}
        </div>
        <div className="card__content">
          {this.props.content}
        </div>
        <div className="card__right">
          {this.props.retroState !== RETRO_STATUS.LOCKED && (
            <button
              onClick={this.handleUpVote}
              className={this.upVoteClass}
            >
              <i className="fa fa-arrow-up fa-inverse" aria-hidden="true"></i>
            </button>
          )}
          {this.props.retroState !== RETRO_STATUS.LOCKED && (
            <button
              onClick={this.handleDownVote}
              className="btn btn-link downvote"
            >
              <i className="fa fa-arrow-down fa-inverse" aria-hidden="true"></i>
            </button>
          )}
          {this.props.showOpenNotesBtn && this.props.retroState === RETRO_STATUS.LOCKED && (
            <button
              onClick={this.handleOpenNotes}
              className="btn btn-link notes js-test-delta-notes"
            >
              <i className="fa fa-pencil-square-o fa-inverse" aria-hidden="true"></i>
            </button>
          )}
          {this.props.retroState !== RETRO_STATUS.LOCKED && (
            <button
              className={this.deleteClass}
              onClick={this.handleDelete}
            >
              <i className="fa fa-trash" aria-hidden="true"></i>
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default Delta;
