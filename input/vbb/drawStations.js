import { map, switchMap } from "rxjs/operators";
import { combineLatest, from } from "rxjs";
import { upsertStation } from "../../output/station";
import { poll } from "../../rx";
import { getSavedStations } from './stations/memoryApi'

import {
  fetchDepartures,
  departuresToAvgDelay,
  fetchStopInfo
} from "./index";
import { makeIndirectFetch } from "../../fn-helpers";


const pollDepartures = stationId =>
poll(2000, makeIndirectFetch(fetchDepartures)({ stationId }));


export const drawStations = (app) => {
  if (window.stops) { 
    window.stops.unsubscribe();
    window.stops = null;
  }
  const stops = getSavedStations()
  window.stops = stops
    .map(stop =>
      from(fetchStopInfo(stop)).pipe(
        switchMap(stopInfo =>
          combineLatest(
            from([stopInfo]),
            pollDepartures(stopInfo.id).pipe(
              map(departures => ({
                avgDelay: departuresToAvgDelay(departures),
                departures
              }))
            )
          )
        )
      )
    )
    .forEach(obs =>
      obs.subscribe(([station, { avgDelay, departures }]) => {
        console.log(station.name, departures);
        upsertStation({ station, avgDelay, departures });
      })
    )
}
