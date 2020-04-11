import emojiRegex from 'emoji-regex';

export const stringIsOnlyEmoji = (str) => {
  return str.length < 5 && emojiRegex().test(str);
};