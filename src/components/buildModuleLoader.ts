import { Container } from 'inversify';
import { take } from 'rxjs/operators';

import { APP_TYPES } from '../types';
import { AppConfig, ServiceIdentifier } from '../inversify.config';
import { EventBus, globalEventBus, GarbageBag, GarbageCollect, Ticker } from '../components';
import { Updatable } from '../utils';

export class BuildModuleLoader {
  private readonly _appContainer = new Container({ skipBaseClassChecks: true });
  private readonly _eventBus = globalEventBus;
  private readonly _garbageBag = new GarbageBag();
  private _updatable: ServiceIdentifier<Updatable> | symbol | undefined;

  constructor(appConfig: AppConfig) {
    this._appContainer.bind<EventBus>(APP_TYPES.EventBus).toConstantValue(globalEventBus);

    this._garbageBag
      .fromEvent$(this._eventBus, 'Ready')
      .pipe(take(1))
      .subscribe(() => this.startTickerUpdate());

    this._garbageBag.add(() => {
      const { onDestroy, pushToGarbage } = appConfig;
      onDestroy(this._appContainer);
      pushToGarbage.forEach((element) => {
        const forGarbage = this._appContainer.get<GarbageCollect>(element);
        forGarbage.cleanGarbageCollect();
      });
    });

    const { preInit } = appConfig;
    preInit(this._appContainer);

    this.initialisation(appConfig);
  }

  private initialisation(appConfig: AppConfig): void {
    const { forUpdate, onInit, onBuild } = appConfig;

    const initModule = onInit(this._appContainer);
    initModule.then(() => {
      onBuild.forEach((element) => {
        this._appContainer.get(element);
      });
      this._updatable = forUpdate;
    });
  }

  private startTickerUpdate(): void {
    const ticker = this._appContainer.get<Ticker>(APP_TYPES.Ticker);
    this._garbageBag.completable$(ticker.ticker$).subscribe((tickerData) => {
      if (this._updatable !== undefined) {
        const updatable = this._appContainer.get<Updatable>(this._updatable);
        updatable.update(tickerData);
      }
    });
  }
}
