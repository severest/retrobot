import React from 'react';
import PropTypes from 'prop-types';

import {
  clearSelectedDeltas,
} from '../../flux/retro/actions.js';

class SelectionControlPanel extends React.Component {
  static propTypes = {
    selectedDeltas: PropTypes.arrayOf(PropTypes.number).isRequired,
  }

  handleClearSelection = () => {
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
        </div>
      </div>
    );
  }
}

export default SelectionControlPanel;
