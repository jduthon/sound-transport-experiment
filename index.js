import { fetchObservable, poll } from "./rx";
import {
  fetchDepartures,
  departuresToAvgDelay,
  fetchStopInfo
} from "./input/vbb";
import { makeIndirectFetch } from "./fn-helpers";
import { delay, distinctUntilChanged, map, switchMap } from "rxjs/operators";
import { combineLatest, from } from "rxjs";
import { upsertStation } from "./output/station";
import {
  startOrUpdateKick,
  startOrUpdateHiHat,
  startOrUpdateCymbal,
  playFromMajorScale
} from "./output/sound";

const stops = {
  alexanderplatz: "S+U Alexanderplatz",
  neukoln: "S neukoln",
  wedding: "S wedding",
  hauptbanhof: "Hauptbanhof",
  schonefeld: "Schonefeld"
};

const pollDepartures = stationId =>
  poll(7000, makeIndirectFetch(fetchDepartures)({ stationId }));

const createStopObs = stop =>
  from(fetchStopInfo(stop)).pipe(
    switchMap(stopInfo =>
      combineLatest(
        from([stopInfo]),
        pollDepartures(stopInfo.id).pipe(
          map(departures => ({
            avgDelay: Math.round(departuresToAvgDelay(departures)),
            departures
          }))
        )
      ).pipe(
        map(([station, { avgDelay, departures }]) => ({
          station,
          avgDelay,
          departures
        }))
      )
    )
  );

const stopsInfo$ = Object.entries(stops).reduce(
  (tmpStopsInfo$, [stopKey, stopName]) => ({
    ...tmpStopsInfo$,
    [stopKey]: createStopObs(stopName)
  }),
  {}
);

Object.values(stopsInfo$).forEach(obs => obs.subscribe(upsertStation));

const compareStopValues = (a, b) =>
  a.avgDelay === b.avgDelay || a.departures.length === b.departures.length;

const onlyWhenChanged = stop$ =>
  stop$.pipe(distinctUntilChanged(compareStopValues));

onlyWhenChanged(stopsInfo$.neukoln).subscribe(startOrUpdateKick);

onlyWhenChanged(stopsInfo$.wedding).subscribe(startOrUpdateHiHat);

onlyWhenChanged(stopsInfo$.schonefeld).subscribe(startOrUpdateCymbal);

Object.values(stopsInfo$)
  .map(obs =>
    obs.pipe(
      switchMap(val => from([val]).pipe(delay(Math.ceil(Math.random() * 2000))))
    )
  )
  .map(obs => obs.subscribe(playFromMajorScale));

/*hafas.journeys('900000003201', '900000024101', {results: 1})
.then((journeys) => console.log(journeys[0]))
.catch(console.error)*/

/*hafas
  .radar(
    {
      north: 52.52411,
      west: 13.41002,
      south: 52.51942,
      east: 13.41709
    },
    { results: 100 }
  )
  .then(radar => console.log(JSON.stringify(radar)))
  .catch(console.error);*/

/*hafas
  .departures("900000100515", { duration: 100 })
  .then(departures => departures.map(({ delay }) => delay !== null && delay))
  .then(delays => avg(delays))
  .then(avg => console.log(avg))
  //.then(departures => departures.map(({delay})))
  //.then(dep => console.log(JSON.stringify(dep)))
  .catch(console.error);*/
