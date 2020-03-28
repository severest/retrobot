import { getAvgTemperature } from "./temperature-checks.js";

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