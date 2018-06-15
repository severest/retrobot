import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import Delta from './components/Delta/Delta.jsx';
import Plus from './components/Plus/Plus.jsx';

class RetroBoard extends React.Component {
  static propTypes = {
    pluses: PropTypes.array.isRequired,
    deltas: PropTypes.array.isRequired,
    maxVotes: PropTypes.number.isRequired,
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
                maxVotes={this.props.maxVotes}
                {...d}
              />
            </CSSTransition>
          )}
        </TransitionGroup>
      </div>
    );
  }
}

export default RetroBoard;
