import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';

import Delta from './Delta.jsx';
import { RETRO_STATUS } from '../../utils/constants.js';

const PROPS = {
  id: 1,
  content: 'delta content',
  index: 1,
  votes: [],
  retroKey: '123456',
  retroState: RETRO_STATUS.IN_PROGRESS,
  showOpenNotesBtn: true,
  maxVotes: 2,
};

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Delta {...PROPS} />, div);
});

it('shows controls when in progress', () => {
  const wrapper = shallow(<Delta {...PROPS} retroState={RETRO_STATUS.IN_PROGRESS} />);
  expect(wrapper.find('.upvote').length).toBe(1);
  expect(wrapper.find('.downvote').length).toBe(1);
  expect(wrapper.find('.notes').length).toBe(0);
  expect(wrapper.find('.card__delete').length).toBe(1);
  expect(wrapper.find('.card__votes').length).toBe(0);
});

it('shows controls when voting', () => {
  const wrapper = shallow(<Delta {...PROPS} retroState={RETRO_STATUS.VOTING} />);
  expect(wrapper.find('.upvote').length).toBe(1);
  expect(wrapper.find('.downvote').length).toBe(1);
  expect(wrapper.find('.notes').length).toBe(0);
  expect(wrapper.find('.card__delete').length).toBe(1);
  expect(wrapper.find('.card__votes').length).toBe(0);
});

it('shows controls when locked', () => {
  const wrapper = shallow(<Delta {...PROPS} retroState={RETRO_STATUS.LOCKED} />);
  expect(wrapper.find('.upvote').length).toBe(0);
  expect(wrapper.find('.downvote').length).toBe(0);
  expect(wrapper.find('.card__votes').length).toBe(1);
  expect(wrapper.find('.notes').length).toBe(1);
  expect(wrapper.find('.card__delete').length).toBe(0);
});
