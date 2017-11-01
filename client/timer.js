import { TIMER_LENGTH } from './utils/constants.js';

import {
  sendTime,
} from './ws/index.js';
import {
  updateTimer,
} from './flux/actions.js';

let timer;

export const startTimer = (callback) => {
  var minutes = TIMER_LENGTH;
  var seconds = 0;
  timer = setInterval(function () {
    if (minutes === 0 && seconds === 0) {
      clearInterval(timer);
      if (callback) {
        callback();
      }
    } else if (seconds === 0) {
      seconds = 59;
      minutes = minutes - 1;
    } else {
      seconds = seconds - 1;
    }
    updateTimer({minutes, seconds});
    sendTime(minutes, seconds);
  }, 1000);
};
