import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import RetroBoard from './RetroBoard.jsx';
import ControlPanel from './components/ControlPanels/ControlPanel.jsx';
import SelectionControlPanel from './components/ControlPanels/SelectionControlPanel.jsx';
import OfflineIndicatorModal from './components/OfflineIndicatorModal/OfflineIndicatorModal.jsx';
import Loader from './components/Loader/Loader.jsx';
import NotesModal from './components/NotesModal/NotesModal.jsx';
import PrevDeltasModal from './components/PrevDeltasModal/PrevDeltasModal.jsx';
import Notifications from './components/Notifications/Notifications.jsx';
import DeltaGroupDisplay from './components/Delta/DeltaGroupDisplay.jsx';
import TemperatureCheckModal from './components/TemperatureCheckModal/TemperatureCheckModal.jsx';
import { RETRO_STATUS } from './utils/constants.js';

import {
  retroBoardInit,
  closeNotesModal,
} from './flux/retro/actions.js';

import socketInit from './ws/index.js';
import retroStore$ from './flux/retro/store.js';

class RetroBoardApp extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.retroKey = props.match.params.key;
    this.state = {
      isLoading: false,
      retro: {
        pluses: [],
        deltas: [],
        selectedDeltas: [],
        deltaGroups: [],
        prevDeltas: [],
        timer: {
          show: false,
          minutes: 0,
          seconds: 0,
        },
        state: RETRO_STATUS.IN_PROGRESS,
        creator: false,
        timeLimitMinutes: 0,
        maxVotes: 0,
        includeTemperatureCheck: false,
      },
      isOffline: false,
      notes: null,
      notesLock: null,
      users: [],
      showPrevDeltasModal: false,
      showTemperatureCheckModal: false,
      deltaGroupDisplay: null,
    };
  }

  componentDidMount() {
    this.storeSubscription = retroStore$.subscribe((state) => {
      this.setState({
        isLoading: state.isLoading,
        retro: {
          pluses: state.pluses,
          deltas: state.deltas,
          selectedDeltas: state.selectedDeltas,
          deltaGroups: state.deltaGroups,
          prevDeltas: state.prevDeltas,
          timer: state.timer,
          state: state.retroStatus,
          creator: state.creator,
          timeLimitMinutes: state.timeLimitMinutes,
          maxVotes: state.maxVotes,
          includeTemperatureCheck: state.includeTemperatureCheck,
        },
        isOffline: state.isOffline,
        notes: state.notes,
        notesLock: state.notesLock,
        users: state.users,
        deltaGroupDisplay: state.deltaGroupDisplay,
      });
    });

    socketInit(this.retroKey);
    retroBoardInit(this.retroKey, this.props.history);
  }

  componentWillUnmount() {
    this.storeSubscription.unsubscribe();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.retro.state === RETRO_STATUS.IN_PROGRESS) {
      if (prevState.retro.prevDeltas.length === 0 && this.state.retro.prevDeltas.length !== 0) {
        this.setState({ showPrevDeltasModal: true });
      }
      if (!prevState.retro.includeTemperatureCheck && this.state.retro.includeTemperatureCheck) {
        this.setState({ showTemperatureCheckModal: true });
      }
    }
  }

  render() {
    if (this.state.isLoading) {
      return <Loader />;
    }

    let deltaForNotes;
    if (this.state.notes && this.state.notesLock === window.myID) {
      deltaForNotes = this.state.retro.deltas.find(d => d.id === this.state.notes);
    }

    return (
      <div>
        {this.state.isOffline && <OfflineIndicatorModal />}
        {deltaForNotes && (
          <NotesModal
            itemId={this.state.notes}
            title={deltaForNotes.content}
            notes={deltaForNotes.notes ? deltaForNotes.notes : ''}
            onClose={() => closeNotesModal()}
          />
        )}
        {this.state.showPrevDeltasModal && (
          <PrevDeltasModal
            prevDeltas={this.state.retro.prevDeltas}
            onClose={() => {
              this.setState({
                showPrevDeltasModal: false,
              });
            }}
          />
        )}
        {this.state.showTemperatureCheckModal && !this.state.showPrevDeltasModal && (
          <TemperatureCheckModal
            onClose={() => this.setState({ showTemperatureCheckModal: false })}
          />
        )}

        <TransitionGroup className="retro-container--controls">
          {this.state.retro.selectedDeltas.length === 0 ? (
            <CSSTransition
              key="normal-controls"
              timeout={200}
              classNames="fade"
            >
              <ControlPanel
                {...this.state.retro}
                userCount={this.state.users.length}
                voteCount={this.state.retro.deltas.reduce((sum, item) => sum + item.votes.length, 0)}
              />
            </CSSTransition>
          ) : (
            <CSSTransition
              key="selection-controls"
              timeout={200}
              classNames="fade"
            >
              <SelectionControlPanel
                isCreator={this.state.retro.creator}
                selectedDeltas={this.state.retro.selectedDeltas}
              />
            </CSSTransition>
          )}
        </TransitionGroup>

        <RetroBoard retroKey={this.retroKey} showOpenNotesBtn={this.state.notesLock === null} {...this.state.retro} />

        {this.state.deltaGroupDisplay && (
          <DeltaGroupDisplay
            retroState={this.state.retro.state}
            deltas={this.state.retro.deltaGroups
              .find(g => g.id === this.state.deltaGroupDisplay).deltas
              .reduce((arr, deltaId) => {
                const delta = this.state.retro.deltas.find(del => del.id === deltaId);
                if (delta) {
                  return arr.concat(delta);
                }
                return arr;
              }, [])
            }
            deltaGroupId={this.state.deltaGroupDisplay}
            isCreator={this.state.retro.creator}
          />
        )}

        <Notifications />
      </div>
    );
  }
}

export default RetroBoardApp;
