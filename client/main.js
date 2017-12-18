import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './styles/application.scss';

import uuid from './utils/uuid.js';

import StartRetroApp from './StartRetroApp.jsx';
import RetroBoardApp from './RetroBoardApp.jsx';
import Particles from './components/Particles/Particles.jsx';

Array.prototype.move = (old_index, new_index) => {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};

let userId = localStorage.getItem('retrobotID');
if (!userId) {
  userId = uuid();
  localStorage.setItem('retrobotID', userId);
}
window.myID = userId;


const NoMatch = () => (
  <Particles code="404" />
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
