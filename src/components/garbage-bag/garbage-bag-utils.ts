import { Observable, fromEventPattern } from 'rxjs';

import { EventEmitterLike, NativeEventEmitterLike } from './garbage-bag-interfaces';
import { GarbageCollect } from './garbage-bag-interfaces';

export type GarbageBagType = () => void;

export function isGarbageCollect(object: any): object is GarbageCollect {
  return 'cleanGarbageCollect' in object && typeof object['cleanGarbageCollect'] === 'function';
}

export function rxFromEventPattern<T>(
  eventEmitter: EventEmitterLike | NativeEventEmitterLike,
  eventType: symbol | string
): Observable<T> {
  return fromEventPattern(
    (handler) => {
      if ('addListener' in eventEmitter) {
        return eventEmitter.addListener(eventType, handler);
      } else if ('addEventListener' in eventEmitter) {
        return eventEmitter.addEventListener(eventType, handler);
      }
    },
    (handler) => {
      if ('removeListener' in eventEmitter) {
        return eventEmitter.removeListener(eventType, handler);
      } else if ('removeEventListener' in eventEmitter) {
        return eventEmitter.removeEventListener(eventType, handler);
      }
    }
  );
}
