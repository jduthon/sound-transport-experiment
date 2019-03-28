import { getApp } from '../page/utils'

const createOrFind = (finderFn, insertFn) => (
  finderProps,
  container,
  extraProps = ""
) => {
  const element = finderFn(container, finderProps);
  if (!element) {
    container.insertAdjacentHTML(
      "beforeend",
      `<div ${insertFn(finderProps)} ${extraProps}></div>`
    );
  }
  return element || finderFn(container, finderProps);
};

const createOrFindById = createOrFind(
  (container, { id }) => container.querySelector(`#${id}`),
  ({ id }) => `id=${id}`
);

const createOrFindByClass = createOrFind(
  (container, { className }) => container.querySelector(`.${className}`),
  ({ className }) => `class=${className}`
);

const getStations = () => createOrFindById({ id: "stations" }, getApp());

const getStation = stationId =>
  createOrFindById(
    { id: `station-${stationId}` },
    getStations(),
    'class="station"'
  );

const getStationDetails = container =>
  createOrFindByClass({ className: "station-details" }, container);

const getStationGauges = container =>
  createOrFindByClass({ className: "station-gauges" }, container);

const getDelay = container =>
  createOrFindByClass({ className: "station-delay" }, container);

const getDepartures = container =>
  createOrFindByClass({ className: "station-departures" }, container);

const createGauge = percentage =>
  `<div class="gauge-container"><div class="gauge-inactive" style="height:${100 -
    percentage}%"></div></div>`;

const updateFlash = element => {
  element.style.transition = "background-color ease-in-out .5s";
  const prevBackgroundColor = element.style.backgroundColor;
  element.style.backgroundColor = "rgba(255, 217, 168, 0.6)";
  window.setTimeout(() => {
    element.style.backgroundColor = prevBackgroundColor;
  }, 500);
};

const previousValues = {};
export const upsertStation = ({ station, avgDelay, departures }) => {
  const stationElement = getStation(station.id);
  const stationDetails = getStationDetails(stationElement);
  if (stationDetails.children.length === 0) {
    stationDetails.innerHTML = `<div>${station.name}</div>`;
  }
  const stationGauges = getStationGauges(stationElement);
  const delayElement = getDelay(stationGauges);
  const prevVal = previousValues[station.id] || {};
  const roundedAvgDelay = Math.round(avgDelay);
  const departuresLength = departures.length;
  delayElement.innerHTML = `<div><div>Delay</div>${createGauge(
    (avgDelay / 50) * 100
  )}<div>${roundedAvgDelay}</div></div>`;
  const departuresElement = getDepartures(stationGauges);
  departuresElement.innerHTML = `<div><div>Departures</div>${createGauge(
    (departuresLength / 150) * 100
  )}<div>${departuresLength}</div></div>`;

  const avgDelayChanged = prevVal.avgDelay !== roundedAvgDelay;
  const departuresLengthChanged = prevVal.departuresLength !== departuresLength;
  if (avgDelayChanged || departuresLengthChanged) {
    updateFlash(stationElement);
    previousValues[station.id] = {
      avgDelay: roundedAvgDelay,
      departuresLength
    };
  }
};
