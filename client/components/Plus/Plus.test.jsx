import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';

import Plus from './Plus.jsx';
import { RETRO_STATUS } from '../../utils/constants.js';

const PROPS = {
  id: 1,
  content: 'plus content',
  index: 1,
  retroKey: '123456',
  retroState: RETRO_STATUS.IN_PROGRESS,
};

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Plus {...PROPS} />, div);
});

it('shows controls when in progress', () => {
  const wrapper = shallow(<Plus {...PROPS} retroState={RETRO_STATUS.IN_PROGRESS} />);
  expect(wrapper.find('.card__delete').length).toBe(1);
});

it('shows controls when voting', () => {
  const wrapper = shallow(<Plus {...PROPS} retroState={RETRO_STATUS.VOTING} />);
  expect(wrapper.find('.card__delete').length).toBe(1);
});

it('shows controls when locked', () => {
  const wrapper = shallow(<Plus {...PROPS} retroState={RETRO_STATUS.LOCKED} />);
  expect(wrapper.find('.card__delete').length).toBe(0);
});
