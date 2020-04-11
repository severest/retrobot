import React from 'react';
import PropTypes from 'prop-types';

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
      {`${minutes}:${seconds < 10 ? '0' + seconds : seconds}`}
    </div>
  );
};

Clock.propTypes = {
  minutes: PropTypes.number.isRequired,
  seconds: PropTypes.number.isRequired,
  show: PropTypes.bool.isRequired,
};

export default Clock;