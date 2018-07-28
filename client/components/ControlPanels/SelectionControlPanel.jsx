import React from 'react';
import PropTypes from 'prop-types';

import {
  clearSelectedDeltas,
} from '../../flux/retro/actions.js';
import {
  sendDeltaGroup,
} from '../../ws/index.js';

class SelectionControlPanel extends React.Component {
  static propTypes = {
    isCreator: PropTypes.bool.isRequired,
    selectedDeltas: PropTypes.arrayOf(PropTypes.number).isRequired,
  }

  handleClearSelection = () => {
    clearSelectedDeltas();
  }

  handleCreateDeltaGroup = () => {
    sendDeltaGroup(this.props.selectedDeltas);
    clearSelectedDeltas();
  }

  render() {
    return (
      <div className="control-panel control-panel--selection">
        <div className="selection-count">
          {`${this.props.selectedDeltas.length} ${this.props.selectedDeltas.length === 1 ? 'delta' : 'deltas'} selected`}
        </div>
        <div className="selection-controls">
          <button
            className="btn btn-default"
            type="button"
            onClick={this.handleClearSelection}
          >
            Clear selection
          </button>
          {this.props.isCreator && this.props.selectedDeltas.length > 1 && (
            <button
              className="btn btn-primary"
              type="button"
              onClick={this.handleCreateDeltaGroup}
            >
              Create group
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default SelectionControlPanel;
