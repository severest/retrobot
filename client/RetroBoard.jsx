import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import Delta from './components/Delta/Delta-DragAndDrop.jsx';
import Plus from './components/Plus/Plus-DragAndDrop.jsx';

class RetroBoard extends React.Component {
  static propTypes = {
    pluses: PropTypes.array.isRequired,
    deltas: PropTypes.array.isRequired,
    retroKey: PropTypes.string.isRequired,
    showOpenNotesBtn: PropTypes.bool.isRequired,
    state: PropTypes.string.isRequired,
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
                retroState={this.props.state}
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
                retroKey={this.props.retroKey}
                showOpenNotesBtn={this.props.showOpenNotesBtn}
                retroState={this.props.state}
                {...d}
              />
            </CSSTransition>
          )}
        </TransitionGroup>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(RetroBoard);
