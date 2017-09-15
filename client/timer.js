import { TIMER_LENGTH } from './utils/constants.js';

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
    var clock = minutes + ':' + (seconds < 10 ? '0' + seconds : seconds);
    updateClock(minutes, seconds, clock);
    WS.sendTime(minutes, seconds, clock);
  }, 1000);
};

export const updateClock = (minutes, seconds, clock) => {
  if (minutes === 0 && seconds === 0) {
      $('.timer').addClass('hide');
      return
  }
  $('.timer').html(clock);
}
