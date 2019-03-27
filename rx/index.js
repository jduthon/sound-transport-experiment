import {
  Observable,
  Subscription,
  of,
  fromEvent,
  from,
  empty,
  merge,
  timer
} from "rxjs";
import {
  map,
  mapTo,
  switchMap,
  tap,
  mergeMap,
  takeUntil,
  filter,
  finalize
} from "rxjs/operators";

export const poll = (interval, fetchFn) =>
  timer(0, interval).pipe(switchMap(_ => from(fetchFn())));
