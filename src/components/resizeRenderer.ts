import { fromEvent, interval, merge, Observable, ReplaySubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, take } from 'rxjs/operators';
import { injectable } from 'inversify';

import { GarbageBag, GarbageCollect } from '../components';
import { Size, ResizeData } from '../utils';

@injectable()
export class ResizeRenderer implements GarbageCollect {
  private readonly _garbageBag = new GarbageBag();
  private readonly _resizeTriggeredSubject$ = new ReplaySubject<ResizeData>(1);

  private readonly _currentSize: Size = { width: 0, height: 0 };

  constructor() {
    const performResize = (size: Size) => {
      this._currentSize.width = size.width;
      this._currentSize.height = size.height;
      this._resizeTriggeredSubject$.next({
        screenSize: size
      });
    };

    const resize$ = merge(fromEvent(window, 'resize')).pipe(
      debounceTime(100),
      switchMap(() =>
        interval(1000).pipe(
          take(4),
          map(() => this.screenSize()),
          distinctUntilChanged((x, y) => x.width === y.width && x.height === y.height)
        )
      )
    );

    this._garbageBag.completable$(resize$).subscribe((size) => {
      performResize(size);
      this.setMetaViewportAttribute(this._currentSize.width, this._currentSize.height);
    });

    performResize(this.screenSize());
  }

  cleanGarbageCollect(): void {
    this._garbageBag.cleanGarbageCollect();
  }

  get resize$(): Observable<ResizeData> {
    return this._resizeTriggeredSubject$;
  }

  private screenSize(): Size {
    const width = Math.max(window.innerWidth || 0);
    const height = Math.max(window.innerHeight || 0);
    return { width: width, height: height };
  }

  private setMetaViewportAttribute(width: number, height: number): void {
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
      viewport.setAttribute(
        'content',
        'width=' +
          width +
          ', height=' +
          height +
          ', viewport-fit=cover, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=0, minimal-ui'
      );
    }
  }
}
