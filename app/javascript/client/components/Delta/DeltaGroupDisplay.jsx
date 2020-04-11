import React from 'react';
import PropTypes from 'prop-types';

import {
  displayDeltaGroup,
} from '../../flux/retro/actions.js';
import {
  deleteDeltaGroup,
  deleteDeltaGroupItem,
} from '../../ws/index.js';
import { RETRO_STATUS } from '../../utils/constants.js';

import DeltaVotes from '../Delta/DeltaVotes.jsx';

class DeltaGroupDisplay extends React.Component {
  static propTypes = {
    deltas: PropTypes.array.isRequired,
    deltaGroupId: PropTypes.number.isRequired,
    retroState: PropTypes.string.isRequired,
    isCreator: PropTypes.bool.isRequired,
  }

  handleRemoveDeltaFromGroup = (deltaId) => () => {
    deleteDeltaGroupItem(deltaId);
  }

  handleClose = () => {
    displayDeltaGroup(null);
  }

  handleDeleteDeltaGroup = () => {
    deleteDeltaGroup(this.props.deltaGroupId);
    displayDeltaGroup(null);
  }

  render() {
    return (
      <div className="modal fade show in" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-body">
              {this.props.deltas
                .map((delta) => {
                  return (
                    <div
                      key={delta.id}
                      className="delta-group-display__item"
                    >
                      <div className="delta-group-display__item__content">
                        {delta.content}
                      </div>
                      {this.props.retroState === RETRO_STATUS.LOCKED && (
                        <div className="delta-group-display__item__votes">
                          {delta.votes.length} {delta.votes.length === 1 ? 'vote' : 'votes'}
                        </div>
                      )}
                      <div className="delta-group-display__item__actions">
                        <DeltaVotes
                          retroState={this.props.retroState}
                          id={delta.id}
                          votes={delta.votes}
                        />
                        {this.props.deltas.length > 2 && this.props.isCreator && (
                          <button
                            type="button"
                            className="btn btn-link"
                            onClick={this.handleRemoveDeltaFromGroup(delta.id)}
                          >
                            <i className="fa fa-times" aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              }
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-link"
                onClick={this.handleClose}
              >
                Close
              </button>
              {this.props.isCreator && (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={this.handleDeleteDeltaGroup}
                >
                  Delete group
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DeltaGroupDisplay;
