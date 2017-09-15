import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import Delta from './Delta.jsx';

class DeltaBoard extends React.Component {
  static propTypes = {
    deltas: PropTypes.array.isRequired,
  }

  render() {
    return (
      <TransitionGroup className="retro-container--delta">
        {this.props.deltas.map((d, i) =>
          <CSSTransition
            key={d.id}
            timeout={200}
            classNames="fade"
          >
            <Delta
              index={i}
              {...d}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    );
  }
}

export default DeltaBoard;
