import { Observable, Subject } from 'rxjs';

import { GarbageBag, GarbageCollect } from '../components';
import { TickerData } from '../utils';

export interface TickerConfig {
  readonly ignoreFocusOff: boolean;
}

const defaultTickerConfig: TickerConfig = {
  ignoreFocusOff: false
};

export class Ticker implements GarbageCollect {
  private readonly _garbageBag = new GarbageBag();
  private readonly _tickerSubject$ = new Subject<TickerData>();
  private readonly _config: TickerConfig;

  private _inactivityBuffer: number = 0;
  private _previousTime: number = 0;
  private readonly _deltaMultiplier: number = 0.06;
  private _rafId: number = 0;

  constructor(config?: Partial<TickerConfig>) {
    this._config = { ...defaultTickerConfig, ...config };

    this.startTicker();
    this._garbageBag.fromEvent$(window, 'focus').subscribe(() => this.update());
  }

  cleanGarbageCollect(): void {
    window.cancelAnimationFrame(this._rafId);
    this._garbageBag.cleanGarbageCollect();
  }

  update(now: number = performance.now()): void {
    const timeDiff = now - this._inactivityBuffer - this._previousTime;
    if (timeDiff > 1000) {
      this._inactivityBuffer += timeDiff;
    }

    const currentTime = this._config.ignoreFocusOff ? now : now - this._inactivityBuffer;
    const elapsedMS = currentTime - this._previousTime;
    const deltaTime = elapsedMS * this._deltaMultiplier;

    const tickerData: TickerData = {
      elapsedMS: elapsedMS,
      lastTime: currentTime,
      deltaTime: deltaTime
    };
    this._tickerSubject$.next(tickerData);
    this._previousTime = currentTime;
  }

  get ticker$(): Observable<TickerData> {
    return this._tickerSubject$.asObservable();
  }

  private startTicker(currentTime: number = performance.now()): void {
    const tick = (currentTime: number) => {
      this.update(currentTime);
      this._rafId = window.requestAnimationFrame(tick);
    };
    tick(currentTime);
  }
}
