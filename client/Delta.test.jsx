import React from 'react';
import ReactDOM from 'react-dom';

import Delta from './Delta.jsx';

const PROPS = {
  id: 1,
  content: 'delta content',
  index: 1,
  votes: 0,
  retroKey: '123456',
};

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Delta {...PROPS} />, div);
});
