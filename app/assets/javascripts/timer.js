var timer;
var timerLengthMinutes = 5;

var startTimer = function (callback) {
  var minutes = timerLengthMinutes;
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
    updateClock(minutes, seconds < 10 ? '0' + seconds : seconds);
    sendTime(minutes, seconds < 10 ? '0' + seconds : seconds);
  }, 1000);
};

var updateClock = function (minutes, seconds) {
  $('.timer .minute').html(minutes);
  $('.timer .second').html(seconds);
}
