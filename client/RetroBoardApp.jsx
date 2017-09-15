import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import DeltaBoard from './DeltaBoard.jsx';
import PlusBoard from './PlusBoard.jsx';

class RetroBoardApp extends React.Component {
  static propTypes = {
    pluses: PropTypes.array.isRequired,
    deltas: PropTypes.array.isRequired,
  }

  render() {
    return (
      <div className="retro-container">
        <PlusBoard pluses={this.props.pluses} />
        <DeltaBoard deltas={this.props.deltas} />
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(RetroBoardApp);
