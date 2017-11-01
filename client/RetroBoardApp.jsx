import React from 'react';
import PropTypes from 'prop-types';

import RetroBoard from './RetroBoard.jsx';
import ControlPanel from './ControlPanel.jsx';

import {
  retroBoardInit,
} from './flux/actions.js';

import socketInit from './ws/index.js';
import store$ from './flux/store.js';

class RetroBoardApp extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.retroKey = props.match.params.key;
    this.state = {
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

    store$.subscribe((state) => {
      this.setState({retro: state});
    });

    socketInit(this.retroKey);
    retroBoardInit(this.retroKey);
  }

  render() {
    return (
      <div>
        <ControlPanel {...this.state.retro} />
        <RetroBoard {...this.state.retro} />
      </div>
    );
  }
}

export default RetroBoardApp;
