import createHafas from "vbb-hafas";
const hafas = createHafas("my-awesome-program");
export const fetchDepartures = ({ stationId, duration }) =>
  hafas.departures(stationId, { duration: duration || 5 });
export const fetchStopInfo = query =>
  hafas
    .locations(query, { results: 5 })
    .then(results => results.filter(({ type }) => type === "stop"))
    .then(stops => stops[0]);
window.hafas = hafas;
