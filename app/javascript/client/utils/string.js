import emojiRegex from 'emoji-regex';

export const stringIsOnlyEmoji = (str) => {
  return str.length < 5 && emojiRegex().test(str);
};

export const showClock = (minutes, seconds) => {
  return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
};
