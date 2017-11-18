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
