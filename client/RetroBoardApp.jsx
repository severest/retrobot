import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import Delta from './Delta.jsx';
import Plus from './Plus.jsx';

class RetroBoardApp extends React.Component {
  static propTypes = {
    pluses: PropTypes.array.isRequired,
    deltas: PropTypes.array.isRequired,
  }

  render() {
    return (
      <div className="retro-container">
        <TransitionGroup className="retro-container--plus">
          {this.props.pluses.filter(p => !p.hide).map((p, i) =>
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

        <TransitionGroup className="retro-container--delta">
          {this.props.deltas.filter(d => !d.hide).map((d, i) =>
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
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(RetroBoardApp);
