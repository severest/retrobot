import sumBy from 'lodash/sumBy';
import isNumber from 'lodash/isNumber';
import round from 'lodash/round';

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
  return round(sum/temperatureChecks.length, 1);
};