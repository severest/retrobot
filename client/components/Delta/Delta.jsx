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
  addDeltaToSelection,
  removeDeltaFromSelection,
} from '../../flux/retro/actions.js';
import { RETRO_STATUS } from '../../utils/constants.js';


class Delta extends React.Component {
  static propTypes = {
    content: PropTypes.string.isRequired,
    userId: PropTypes.string,
    id: PropTypes.number.isRequired,
    votes: PropTypes.arrayOf(PropTypes.string).isRequired,
    hide: PropTypes.bool,
    retroState: PropTypes.string.isRequired,
    showOpenNotesBtn: PropTypes.bool.isRequired,
    selected: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    hide: false,
    userId: '',
  }

  handleUpVote = (e) => {
    e.stopPropagation();
    sendUpVote('delta', this.props.id);
  }

  handleDownVote = (e) => {
    e.stopPropagation();
    sendDownVote('delta', this.props.id);
  }

  handleDelete = (e) => {
    e.stopPropagation();
    deleteDelta(this.props.id);
  }

  handleOpenNotes = (e) => {
    e.stopPropagation();
    openNotesModal(this.props.id);
  }

  handleDeltaClick = () => {
    if (this.props.selected) {
      removeDeltaFromSelection(this.props.id);
    } else {
      addDeltaToSelection(this.props.id);
    }
  }

  get topClass() {
    return classNames(
      'card',
      'delta-card',
      'js-test-delta',
      {
        'delta-card--selected': this.props.selected,
      },
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
      'js-test-delta-upvote',
      {
        'mine': this.props.votes.includes(window.myID),
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
      <div
        className={this.topClass}
        onClick={this.handleDeltaClick}
      >
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
