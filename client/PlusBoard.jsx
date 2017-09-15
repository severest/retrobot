import React from 'react';
import PropTypes from 'prop-types';

import Plus from './Plus.jsx';

class PlusBoard extends React.Component {
  static propTypes = {
    pluses: PropTypes.array.isRequired,
  }

  render() {
    return (
      <div className="retro-container--plus">
        {this.props.pluses.map((p, i) =>
          <Plus
            key={p.id}
            index={i}
            {...p}
          />
        )}
      </div>
    );
  }
}

export default PlusBoard;
