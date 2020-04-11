import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';

import DeltaVotes from './DeltaVotes.jsx';
import { RETRO_STATUS } from '../../utils/constants.js';

const PROPS = {
  id: 1,
  votes: [],
  retroState: RETRO_STATUS.IN_PROGRESS,
};

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<DeltaVotes {...PROPS} />, div);
});

it('shows controls when in progress', () => {
  const wrapper = shallow(<DeltaVotes {...PROPS} retroState={RETRO_STATUS.IN_PROGRESS} />);
  expect(wrapper.find('.upvote').length).toBe(1);
  expect(wrapper.find('.downvote').length).toBe(1);
});

it('shows controls when voting', () => {
  const wrapper = shallow(<DeltaVotes {...PROPS} retroState={RETRO_STATUS.VOTING} />);
  expect(wrapper.find('.upvote').length).toBe(1);
  expect(wrapper.find('.downvote').length).toBe(1);
});

it('shows controls when locked', () => {
  const wrapper = shallow(<DeltaVotes {...PROPS} retroState={RETRO_STATUS.LOCKED} />);
  expect(wrapper.find('.upvote').length).toBe(0);
  expect(wrapper.find('.downvote').length).toBe(0);
});
