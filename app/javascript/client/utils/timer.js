import {
  sendTime,
} from '../ws/index.js';
import {
  updateTimer,
} from '../flux/retro/actions.js';

let timer;

export const startTimer = (timerMinutes) => {
  var minutes = timerMinutes;
  var seconds = 0;
  timer = setInterval(function () {
    if (minutes === 0 && seconds === 0) {
      clearInterval(timer);
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

export const clearTimer = () => {
  clearInterval(timer);
};
