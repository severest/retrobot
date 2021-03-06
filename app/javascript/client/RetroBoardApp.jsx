import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import classNames from 'classnames';
import { Prompt } from 'react-router-dom';

import RetroBoard from './RetroBoard.jsx';
import RetroSideMenu from './components/SideMenu/RetroSideMenu.jsx';
import OpenSideMenuButton from './components/SideMenu/OpenSideMenuButton.jsx';
import RetroInput from './components/ControlPanels/RetroInput.jsx';
import SelectionControlPanel from './components/ControlPanels/SelectionControlPanel.jsx';
import OfflineIndicatorModal from './components/OfflineIndicatorModal/OfflineIndicatorModal.jsx';
import Loader from './components/Loader/Loader.jsx';
import NotesModal from './components/NotesModal/NotesModal.jsx';
import PrevDeltasModal from './components/PrevDeltasModal/PrevDeltasModal.jsx';
import Notifications from './components/Notifications/Notifications.jsx';
import DeltaGroupDisplay from './components/Delta/DeltaGroupDisplay.jsx';
import TemperatureCheckModal from './components/TemperatureCheck/TemperatureCheckModal.jsx';
import TemperatureCheckSummary from './components/TemperatureCheck/TemperatureCheckSummary.jsx';
import { RETRO_STATUS } from './utils/constants.js';

import {
  retroBoardInit,
  closeNotesModal,
} from './flux/retro/actions.js';

import socketInit from './ws/index.js';
import retroStore$ from './flux/retro/store.js';
import { clearTimer } from './utils/timer.js';
import { setDocumentTitle } from './utils/viewport.js';
import { showClock } from './utils/string.js';

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
        myTemperatureCheck: null,
        temperatureChecks: [],
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
      showTemperatureCheckSummary: false,
      deltaGroupDisplay: null,
      sideMenuOpen: false,
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
          myTemperatureCheck: state.myTemperatureCheck,
          temperatureChecks: state.temperatureChecks,
          timer: state.timer,
          state: state.retroStatus,
          creator: state.creator,
          timeLimitMinutes: state.timeLimitMinutes,
          maxVotes: state.maxVotes,
          includeTemperatureCheck: state.includeTemperatureCheck,
          team: state.team,
        },
        isOffline: state.isOffline,
        notes: state.notes,
        notesLock: state.notesLock,
        users: state.users,
        deltaGroupDisplay: state.deltaGroupDisplay,
      });
      if (state.timer.show) {
        setDocumentTitle(showClock(state.timer.minutes, state.timer.seconds));
      } else {
        setDocumentTitle(this.retroKey);
      }
    });

    socketInit(this.retroKey);
    retroBoardInit(this.retroKey, this.props.history);
  }

  componentWillUnmount() {
    this.storeSubscription.unsubscribe();
    clearTimer();
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

  handleOpenSideMenu = () => {
    this.setState({ sideMenuOpen: true });
  }
  handleCloseSideMenu = () => {
    this.setState({ sideMenuOpen: false });
  }

  handleClosePrevDeltasModal = () => {
    this.setState({ showPrevDeltasModal: false });
  }

  handleOpenMyTempCheckModal = () => {
    this.setState({ showTemperatureCheckModal: true });
  }
  handleCloseMyTempCheckModal = () => {
    this.setState({ showTemperatureCheckModal: false });
  }

  handleOpenTempCheckSummaryModal = () => {
    this.setState({ showTemperatureCheckSummary: true });
  }
  handleCloseTempCheckSummaryModal = () => {
    this.setState({ showTemperatureCheckSummary: false });
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
      <div className="retro">
        <Prompt
          when={this.state.retro.timer.show}
          message="You are in the middle of a retro. Do you still want to leave?"
        />

        {this.state.isOffline && <OfflineIndicatorModal />}
        {deltaForNotes && (
          <NotesModal
            itemId={this.state.notes}
            title={deltaForNotes.content}
            notes={deltaForNotes.notes ? deltaForNotes.notes : ''}
            onClose={closeNotesModal}
          />
        )}
        {this.state.showPrevDeltasModal && (
          <PrevDeltasModal
            prevDeltas={this.state.retro.prevDeltas}
            onClose={this.handleClosePrevDeltasModal}
          />
        )}
        {this.state.showTemperatureCheckModal && (
          <TemperatureCheckModal
            disabled={this.state.retro.state === RETRO_STATUS.LOCKED}
            temperatureCheck={this.state.retro.myTemperatureCheck}
            onClose={this.handleCloseMyTempCheckModal}
          />
        )}
        {this.state.showTemperatureCheckSummary && (
          <TemperatureCheckSummary
            temperatureChecks={this.state.retro.temperatureChecks}
            onClose={this.handleCloseTempCheckSummaryModal}
          />
        )}
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

        <OpenSideMenuButton onClick={this.handleOpenSideMenu} />

        <div className={classNames(
          'retro-left',
          {
            'retro-left--hidden': !this.state.sideMenuOpen,
          },
        )}>
          <RetroSideMenu
            {...this.state.retro}
            retroKey={this.retroKey}
            userCount={this.state.users.length}
            voteCount={this.state.retro.deltas.reduce((sum, item) => sum + item.votes.length, 0)}
            onCloseMenu={this.handleCloseSideMenu}
            onShowMyTempCheck={this.handleOpenMyTempCheckModal}
            onShowTempCheckSummary={this.handleOpenTempCheckSummaryModal}
          />
        </div>
        <div className="retro-right">
          <RetroBoard retroKey={this.retroKey} showOpenNotesBtn={this.state.notesLock === null} {...this.state.retro} />
          <TransitionGroup className="retro-right-bottom">
            {this.state.retro.selectedDeltas.length === 0 ? (
              <CSSTransition
                key="normal-controls"
                timeout={200}
                classNames="fade"
              >
                <RetroInput state={this.state.retro.state} />
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
        </div>

        <Notifications />
      </div>
    );
  }
}

export default RetroBoardApp;
