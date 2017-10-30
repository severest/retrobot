import React from 'react';
import PropTypes from 'prop-types';

import RetroBoard from './RetroBoard.jsx';

import {
  addPlus,
  addDelta,
} from './flux/actions.js';

import {
  sendPlus,
} from './ws/index.js';

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

    fetch(`/api/retro/${this.retroKey}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then(function(res) {
      return res.json();
    })
    .then(function (retro) {
      retro.deltas.forEach((delta) => addDelta(delta));
      retro.pluses.forEach((plus) => addPlus(plus));
    });
  }

  handleSendPlus = () => {
    if ($(this.inputBox).val().trim() === '') return;
    sendPlus($(this.inputBox).val().trim(), window.myID);
    $(this.inputBox).val('');
  }

  render() {
    return (
      <div>
        <div className="control-panel">
          <div>
            Retrobot
          </div>
          <div className="start-timer hide">
            <button className="btn btn-primary" id="startTimerBtn">Start timer</button>
          </div>
          <div className="timer hide"></div>
          <div className="input-group create-items">
            <input type="text" ref={c => this.inputBox = c} className="form-control" />
            <span className="input-group-btn">
              <button className="btn btn-default" onClick={this.handleSendPlus} type="button">Plus</button>
              <button className="btn btn-default" id="sendDeltaBtn" type="button">Delta</button>
            </span>
          </div>
        </div>
        <RetroBoard {...this.state.retro} />
      </div>
    );
  }
}

export default RetroBoardApp;
