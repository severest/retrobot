import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import debounce from 'lodash/debounce';

import '../client/styles/application.scss';

import uuid from '../client/utils/uuid.js';

import {
    isOnline,
    isOffline,
} from '../client/flux/retro/actions.js';
import { setViewportUnits } from '../client/utils/viewport.js';

import StartRetroApp from '../client/StartRetroApp-Loadable.jsx';
import RetroBoardApp from '../client/RetroBoardApp-Loadable.jsx';
import TeamSummaryApp from '../client/TeamSummaryApp-Loadable.jsx';
import Particles from '../client/components/Particles/Particles.jsx';

if (TESTING) {
    // time travel for testing
    const tk = require('timekeeper');
    tk.travel(new Date('2020-01-16'));

    window.myID = '11111-abcdefg';
} else {
    // User ID generator
    let userId = localStorage.getItem('retrobotID');
    if (!userId) {
        userId = uuid();
        localStorage.setItem('retrobotID', userId);
    }
    window.myID = userId;
}

// Online/Offline indicators
window.addEventListener('online', () => isOnline());
window.addEventListener('offline', () => isOffline());

// Viewport variables
const viewportUpdateDebounced = debounce(setViewportUnits, 100);
window.addEventListener('resize', viewportUpdateDebounced);
setViewportUnits();

// 404
const NoMatch = () => (
    <Particles code="404" />
);

///// Setup router
ReactDOM.render((
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={StartRetroApp} />
            <Route path="/retro/:key" component={RetroBoardApp} />
            <Route path="/summary/:team" component={TeamSummaryApp} />
            <Route component={NoMatch} />
        </Switch>
    </BrowserRouter>
), document.getElementById('app'));
