import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
  deleteDelta,
} from '../../ws/index.js';
import {
  openNotesModal,
  addDeltaToSelection,
  removeDeltaFromSelection,
  displayDeltaGroup,
} from '../../flux/retro/actions.js';
import { RETRO_STATUS } from '../../utils/constants.js';

import DeltaVotes from './DeltaVotes.jsx';


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
    deltaGroupId: PropTypes.number,
    deltaGroupDeltas: PropTypes.array,
  }

  static defaultProps = {
    hide: false,
    userId: '',
    deltaGroupDeltas: [],
  }

  handleDelete = (e) => {
    e.stopPropagation();
    deleteDelta(this.props.id);
  }

  handleOpenNotes = (e) => {
    e.stopPropagation();
    openNotesModal(this.props.id);
  }

  handleDeltaClick = (e) => {
    e.stopPropagation();
    const ids = this.props.deltaGroupDeltas.length ? this.props.deltaGroupDeltas : [this.props.id];
    if (this.props.selected) {
      removeDeltaFromSelection(ids);
    } else {
      addDeltaToSelection(ids);
    }
  }

  handleGroupDisplay = (e) => {
    e.stopPropagation();
    displayDeltaGroup(this.props.deltaGroupId);
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
        {this.props.deltaGroupDeltas.length > 1 && (
          <button
            className="btn card__group"
            onClick={this.handleGroupDisplay}
          >
            {`+${this.props.deltaGroupDeltas.length - 1}`}
          </button>
        )}
        <div className="card__left">
          <i className="fa fa-exclamation-triangle" aria-hidden="true" />
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
          <DeltaVotes
            retroState={this.props.retroState}
            id={this.props.id}
            votes={this.props.votes}
          />
          {this.props.showOpenNotesBtn && this.props.retroState === RETRO_STATUS.LOCKED && (
            <button
              onClick={this.handleOpenNotes}
              className="btn btn-link notes js-test-delta-notes"
            >
              <i className="fa fa-pencil-square-o fa-inverse" aria-hidden="true" />
            </button>
          )}
          {this.props.retroState !== RETRO_STATUS.LOCKED && this.props.deltaGroupDeltas.length === 0 && (
            <button
              className={this.deleteClass}
              onClick={this.handleDelete}
            >
              <i className="fa fa-trash" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default Delta;
