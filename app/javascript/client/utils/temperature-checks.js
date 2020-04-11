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
    return parseFloat(temperature);
  });
  return round(sum/temperatureChecks.length, 1);
};

export const getTemperatureIcon = (temperature) => {
  if (!isNumber(temperature)) {
    temperature = parseFloat(temperature);
  }

  if (temperature < 2) {
    return 'thermometer-0';
  }
  if (temperature < 4) {
    return 'thermometer-1';
  }
  if (temperature < 6) {
    return 'thermometer-2';
  }
  if (temperature < 8) {
    return 'thermometer-3';
  }
  return 'thermometer-4';
}