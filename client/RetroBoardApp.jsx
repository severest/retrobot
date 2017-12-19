import React from 'react';
import PropTypes from 'prop-types';

import RetroBoard from './RetroBoard.jsx';
import ControlPanel from './ControlPanel.jsx';
import Loader from './components/Loader/Loader.jsx';

import {
  retroBoardInit,
} from './flux/actions.js';

import socketInit from './ws/index.js';
import store$ from './flux/store.js';

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
        timer: {
          show: false,
          minutes: 0,
          seconds: 0,
        }
      },
    };
  }

  componentDidMount() {
    if (!sessionStorage.getItem(`totalVotes-${this.retroKey}`)) {
      sessionStorage.setItem(`totalVotes-${this.retroKey}`, 0);
    }

    this.storeSubscription = store$.subscribe((state) => {
      this.setState({
        isLoading: state.isLoading,
        retro: {
          pluses: state.pluses,
          deltas: state.deltas,
          timer: state.timer,
        },
      });
    });

    socketInit(this.retroKey);
    retroBoardInit(this.retroKey, this.props.history);
  }

  componentWillUnmount() {
    this.storeSubscription.unsubscribe();
  }

  render() {
    if (this.state.isLoading) {
      return <Loader />;
    }

    return (
      <div>
        <ControlPanel {...this.state.retro} />
        <RetroBoard retroKey={this.retroKey} {...this.state.retro} />
      </div>
    );
  }
}

export default RetroBoardApp;
