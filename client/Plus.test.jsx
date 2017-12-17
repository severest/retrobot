import React from 'react';
import ReactDOM from 'react-dom';

import Plus from './Plus.jsx';

const PROPS = {
  id: 1,
  content: 'plus content',
  index: 1,
  retroKey: '123456',
};

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Plus {...PROPS} />, div);
});
