import { fetchObservable, poll } from "./rx";
import {
  fetchDepartures,
  departuresToAvgDelay,
  fetchStopInfo
} from "./input/vbb";
import { makeIndirectFetch } from "./fn-helpers";
import { map, switchMap } from "rxjs/operators";
import { combineLatest, from } from "rxjs";
import { upsertStation } from "./output/station";
import { getSavedStations } from './page/stationList'
import { drawForm } from './page/addStationForm'

const stops = getSavedStations()

const pollDepartures = stationId =>
  poll(2000, makeIndirectFetch(fetchDepartures)({ stationId }));

  drawForm()
stops
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
  );
