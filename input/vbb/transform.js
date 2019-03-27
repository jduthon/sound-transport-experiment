const sum = arr => arr.reduce((sum, cur) => sum + cur, 0);
const avg = arr => sum(arr) / arr.length;
export const departuresToAvgDelay = departures =>
  avg(departures.map(({ delay }) => delay || 0));
