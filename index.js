import Tone from "tone"
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

window.tone = Tone;
//create a synth and connect it to the master output (your speakers)
var synth = new Tone.PolySynth(3).toMaster();
synth.triggerAttackRelease(["C4", "Eb4", "G4"], "4n");
window.synth = synth;

//play a middle 'C' for the duration of an 8th note

const stops = ["S+U Alexanderplatz", "U Moritzplatz", "U Weinmeisterstraße"];

const pollDepartures = stationId =>
  poll(2000, makeIndirectFetch(fetchDepartures)({ stationId }));

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
      upsertStation({ station, avgDelay, departures });
    })
  );

//pollDelays.subscribe(t => console.log(t));

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
