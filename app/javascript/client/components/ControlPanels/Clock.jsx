import React from 'react';
import PropTypes from 'prop-types';

import { showClock } from '../../utils/string.js';

const Clock = ({
  minutes,
  seconds,
  show,
}) => {
  if (!show) {
    return null;
  }
  return (
    <div className="clock js-test-timer">
      {showClock(minutes, seconds)}
    </div>
  );
};

Clock.propTypes = {
  minutes: PropTypes.number.isRequired,
  seconds: PropTypes.number.isRequired,
  show: PropTypes.bool.isRequired,
};

export default Clock;
