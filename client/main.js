import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './styles/application.scss';

import uuid from './utils/uuid.js';

import {
  isOnline,
  isOffline,
} from './flux/actions.js';

import StartRetroApp from './StartRetroApp-Loadable.jsx';
import RetroBoardApp from './RetroBoardApp-Loadable.jsx';
import TeamSummaryApp from './TeamSummaryApp-Loadable.jsx';
import Particles from './components/Particles/Particles.jsx';


let userId = localStorage.getItem('retrobotID');
if (!userId) {
  userId = uuid();
  localStorage.setItem('retrobotID', userId);
}
window.myID = userId;

window.addEventListener('online', () => isOnline());
window.addEventListener('offline', () => isOffline());


const NoMatch = () => (
  <Particles code="404" />
);

ReactDOM.render((
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={StartRetroApp}/>
      <Route path="/retro/:key" component={RetroBoardApp}/>
      <Route path="/summary/:team" component={TeamSummaryApp}/>
      <Route component={NoMatch}/>
    </Switch>
  </BrowserRouter>
), document.getElementById('app'));
