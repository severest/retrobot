import { getAvgTemperature, getTemperatureIcon } from "./temperature-checks.js";

it('gets average temperature', () => {
  const temps = [
    { temperature: '1' },
    { temperature: 2 },
    { temperature: 0 },
    { temperature: 9.8 },
    { temperature: '6.3' },
  ]
  expect(getAvgTemperature(temps)).toBe(3.8);
});

it('returns 0 average temperature when empty array', () => {
  expect(getAvgTemperature([])).toBe(0);
});

it.each([
  ['0.2', 0],
  ['0', 0],
  [0, 0],
  [1.7, 0],
  [2.3, 1],
  ['3.9', 1],
  ['4.9', 2],
  [5, 2],
  [6, 3],
  ['7.3', 3],
  ['10', 4],
  [10, 4],
])('returns a valid icon name with temp %s', (temp, expected) => {
  expect(getTemperatureIcon(temp)).toEqual(`thermometer-${expected}`);
});