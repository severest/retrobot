import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import Plus from './Plus.jsx';

class PlusBoard extends React.Component {
  static propTypes = {
    pluses: PropTypes.array.isRequired,
  }

  render() {
    return (
      <TransitionGroup className="retro-container--plus">
        {this.props.pluses.map((p, i) =>
          <CSSTransition
            key={p.id}
            timeout={200}
            classNames="fade"
          >
            <Plus
              index={i}
              {...p}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    );
  }
}

export default PlusBoard;
