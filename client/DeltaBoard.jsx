import React from 'react';
import PropTypes from 'prop-types';

import Delta from './Delta.jsx';

class DeltaBoard extends React.Component {
  static propTypes = {
    deltas: PropTypes.array.isRequired,
  }

  render() {
    return (
      <div className="retro-container--delta">
        {this.props.deltas.map((d, i) =>
          <Delta
            key={d.id}
            index={i}
            {...d}
          />
        )}
      </div>
    );
  }
}

export default DeltaBoard;
