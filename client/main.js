import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './styles/application.scss';

import uuid from './utils/uuid.js';

import RetroBoardApp from './RetroBoardApp.jsx';

Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};

window.myID = uuid();





const StartRetroApp = ({ history }) => {
  const startRetroClick = () => {
    fetch('/api/retro/new', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({}),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then(function(res) {
      return res.json();
    })
    .then(function (retro) {
      history.push(`/retro/${retro.key}`);
    });
  }
  return (
    <div>
      <div className="control-panel">
        <div>
          Retrobot
        </div>
      </div>

      <div className="create-retro">
        <button className="btn btn-primary create-retro-btn" onClick={startRetroClick}>
          <i className="fa fa-play" aria-hidden="true"></i> Start retro
        </button>
      </div>
    </div>
  );
};



const NoMatch = () => (
  <div>404</div>
);

ReactDOM.render((
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={StartRetroApp}/>
      <Route path="/retro/:key" component={RetroBoardApp}/>
      <Route component={NoMatch}/>
    </Switch>
  </BrowserRouter>
), document.getElementById('app'));



// window.addEventListener("load", () => {
//   const retroBoard = document.getElementById('retroBoard');
//   if (retroBoard) {
    // if (!sessionStorage.getItem(`totalVotes-${App.retroKey}`)) {
    //   sessionStorage.setItem(`totalVotes-${App.retroKey}`, 0);
    // }
//
//     $('.create-items').removeClass('hide');
//     $('.start-timer').removeClass('hide');
//
//     $('#startTimerBtn').click(function () {
//         startTimer();
//     });
//
//     $('#sendPlusBtn').click(function () {
      // if ($('#content').val().trim() === '') return;
      // WS.sendPlus($('#content').val().trim(), window.myID);
      // $('#content').val('');
//     });
//     $('#sendDeltaBtn').click(function () {
//       if ($('#content').val().trim() === '') return;
//       WS.sendDelta($('#content').val().trim(), window.myID);
//       $('#content').val('');
//     });
//
    // store$.subscribe((state) => {
    //   ReactDOM.render(<RetroBoard {...state} />, retroBoard);
    // });
//
    // WS.connectToRetro(App.retroKey, (data) => {
    //   data.hide = !(data.userId === window.myID || $('.timer:visible').length === 0);
    //   if (data.type === 'plus') {
    //     addPlus(data);
    //   }
    //   if (data.type === 'delta') {
    //     addDelta(data);
    //   }
    //   if (data.type === 'time') {
    //     $('.start-timer').addClass('hide')
    //     $('.timer').removeClass('hide');
    //     updateClock(data.minutes, data.seconds, data.clock);
    //     if (data.minutes === 0 && data.seconds === 0) {
    //         unhideAll();
    //     }
    //   }
    //
    //   if (data.type === 'upvote' || data.type === 'downvote') {
    //     updateVotes(data);
    //   }
    //   if (data.type === 'delete' && data.itemType === 'delta') {
    //     removeDelta(data);
    //   }
    //   if (data.type === 'delete' && data.itemType === 'plus') {
    //     removePlus(data);
    //   }
    // });
//
//     _.forEach(App.cards, (card) => {
//       if (card.type === 'plus') {
//         addPlus(card);
//       }
//       if (card.type === 'delta') {
//         addDelta(card);
//       }
//     });
//   }
//
