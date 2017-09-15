import React from 'react';
import PropTypes from 'prop-types';

import Plus from './Plus.jsx';
import Delta from './Delta.jsx';

class RetroBoardApp extends React.Component {
  static propTypes = {
    pluses: PropTypes.array.isRequired,
    deltas: PropTypes.array.isRequired,
  }

  render() {
    return (
      <div className="retro-container">
        <div className="retro-container--plus">
          {this.props.pluses.map((p) =>
            <Plus
              key={p.id}
              {...p}
            />
          )}
        </div>
        <div className="retro-container--delta">
          {this.props.deltas.map((d) =>
            <Delta
              key={d.id}
              {...d}
            />
          )}
        </div>
      </div>
    );
  }
}

export default RetroBoardApp;
