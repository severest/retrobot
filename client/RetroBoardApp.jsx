import React from 'react';
import PropTypes from 'prop-types';

import RetroBoard from './RetroBoard.jsx';
import ControlPanel from './ControlPanel.jsx';
import OfflineIndicatorModal from './components/OfflineIndicatorModal/OfflineIndicatorModal.jsx';
import Loader from './components/Loader/Loader.jsx';
import NotesModal from './components/NotesModal/NotesModal.jsx';
import PrevDeltasModal from './components/PrevDeltasModal/PrevDeltasModal.jsx';
import Notifications from './components/Notifications/Notifications.jsx';
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
      },
      isOffline: false,
      notes: null,
      notesLock: null,
      users: [],
      showPrevDeltasModal: false,
    };
  }

  componentDidMount() {
    this.storeSubscription = retroStore$.subscribe((state) => {
      this.setState({
        isLoading: state.isLoading,
        retro: {
          pluses: state.pluses,
          deltas: state.deltas,
          prevDeltas: state.prevDeltas,
          timer: state.timer,
          state: state.retroStatus,
          creator: state.creator,
          timeLimitMinutes: state.timeLimitMinutes,
          maxVotes: state.maxVotes,
        },
        isOffline: state.isOffline,
        notes: state.notes,
        notesLock: state.notesLock,
        users: state.users,
      });
    });

    socketInit(this.retroKey);
    retroBoardInit(this.retroKey, this.props.history);
  }

  componentWillUnmount() {
    this.storeSubscription.unsubscribe();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.retro.prevDeltas.length === 0 &&
        this.state.retro.prevDeltas.length !== 0 &&
        this.state.retro.state === RETRO_STATUS.IN_PROGRESS) {
      this.setState({ showPrevDeltasModal: true });
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
            onClose={() => this.setState({ showPrevDeltasModal: false })}
          />
        )}
        <ControlPanel
          {...this.state.retro}
          userCount={this.state.users.length}
          voteCount={this.state.retro.deltas.reduce((sum, item) => sum + item.votes.length, 0)}
        />
        <RetroBoard retroKey={this.retroKey} showOpenNotesBtn={this.state.notesLock === null} {...this.state.retro} />
        <Notifications />
      </div>
    );
  }
}

export default RetroBoardApp;
