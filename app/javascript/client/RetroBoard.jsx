import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import Delta from './components/Delta/Delta.jsx';
import Plus from './components/Plus/Plus.jsx';
import Clock from './components/ControlPanels/Clock.jsx';

class RetroBoard extends React.Component {
  static propTypes = {
    pluses: PropTypes.array.isRequired,
    deltas: PropTypes.array.isRequired,
    selectedDeltas: PropTypes.arrayOf(PropTypes.number).isRequired,
    deltaGroups: PropTypes.array.isRequired,
    maxVotes: PropTypes.number.isRequired,
    retroKey: PropTypes.string.isRequired,
    showOpenNotesBtn: PropTypes.bool.isRequired,
    state: PropTypes.string.isRequired,
    timer: PropTypes.object.isRequired,
  }

  render() {
    return (
      <div className="retro-container">
        <Clock {...this.props.timer} />

        <TransitionGroup className="retro-container--plus">
          {this.props.pluses.filter(p => !p.hide).map((p) =>
            <CSSTransition
              key={p.id}
              timeout={200}
              classNames="fade"
            >
              <Plus
                retroState={this.props.state}
                {...p}
              />
            </CSSTransition>
          )}
        </TransitionGroup>

        <TransitionGroup className="retro-container--delta">
          {this.props.deltas
            .map((delta) => {
              const group = this.props.deltaGroups.find((g) => g.deltas.includes(delta.id));
              const votes = group ? group.deltas.reduce((arr, groupDeltaId) => {
                const groupDelta = this.props.deltas.find(del => del.id === groupDeltaId);
                if (groupDelta) {
                  return arr.concat(groupDelta.votes);
                }
                return arr;
              }, []) : delta.votes;
              return {
                ...delta,
                deltaGroupId: group ? group.id : null,
                deltaGroupDeltas: group ? group.deltas : [],
                hide: delta.hide || (group && group.deltas[0] !== delta.id),
                votes,
              };
            })
            .filter(d => !d.hide)
            .map((d) => {
              return (
                <CSSTransition
                  key={d.id}
                  timeout={200}
                  classNames="fade"
                >
                  <Delta
                    showOpenNotesBtn={this.props.showOpenNotesBtn}
                    retroState={this.props.state}
                    selected={this.props.selectedDeltas.includes(d.id)}
                    {...d}
                  />
                </CSSTransition>
              );
            })
          }
        </TransitionGroup>
      </div>
    );
  }
}

export default RetroBoard;
