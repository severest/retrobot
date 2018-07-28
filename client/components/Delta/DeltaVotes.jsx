import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
  sendUpVote,
  sendDownVote,
} from '../../ws/index.js';
import { RETRO_STATUS } from '../../utils/constants.js';


class DeltaVotes extends React.Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    votes: PropTypes.arrayOf(PropTypes.string).isRequired,
    retroState: PropTypes.string.isRequired,
  }

  handleUpVote = (e) => {
    e.stopPropagation();
    sendUpVote('delta', this.props.id);
  }

  handleDownVote = (e) => {
    e.stopPropagation();
    sendDownVote('delta', this.props.id);
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

  render() {
    if (this.props.retroState === RETRO_STATUS.LOCKED) return null;
    return (
      <React.Fragment>
        <button
          onClick={this.handleUpVote}
          className={this.upVoteClass}
        >
          <i className="fa fa-arrow-up fa-inverse" aria-hidden="true" />
        </button>
        <button
          onClick={this.handleDownVote}
          className="btn btn-link downvote"
        >
          <i className="fa fa-arrow-down fa-inverse" aria-hidden="true" />
        </button>
      </React.Fragment>
    );
  }
}

export default DeltaVotes;
