import sumBy from 'lodash/sumBy';
import isNumber from 'lodash/isNumber';

export const getAvgTemperature = (temperatureChecks) => {
  if (temperatureChecks.length === 0) {
    return 0;
  }
  const sum = sumBy(temperatureChecks, ({ temperature }) => {
    if (isNumber(temperature)) {
      return temperature;
    }
    return parseInt(temperature);
  });
  return Math.round(sum/temperatureChecks.length);
};