import { Container } from 'inversify';
import 'reflect-metadata';
import PIXI from 'pixi.js-legacy';

import { APP_TYPES } from './types';
import {
  GarbageCollect,
  Renderer,
  BucketRenderer,
  ResizeRenderer,
  EventBus,
  Ticker,
  BuildModuleLoader
} from './components';
import { AppFlowModel } from './model';
import {
  MainMenuPresenter,
  TopMenuPresenter,
  FirstPartPresenter,
  SecondPartPresenter,
  ThirdPartPresenter
} from './presenters';
import { AppView } from './views';
import { Updatable } from './utils';

export interface AppConfig {
  readonly forUpdate: symbol | ServiceIdentifier<Updatable>;
  readonly onBuild: ReadonlyArray<ServiceIdentifier<Updatable> | symbol>;
  readonly preInit: (appContainer: Container) => void;
  readonly onInit: (appContainer: Container) => Promise<void>;
  readonly pushToGarbage: ReadonlyArray<ServiceIdentifier<GarbageCollect> | symbol>;
  readonly onDestroy: (appContainer: Container) => void;
}

export declare type ServiceIdentifier<T = unknown> = new (...args: any[]) => T;

export const appConfig: AppConfig = {
  forUpdate: APP_TYPES.Renderer,
  onBuild: [
    APP_TYPES.AppFlowModel,
    APP_TYPES.MainMenuPresenter,
    APP_TYPES.TopMenuPresenter,
    APP_TYPES.FirstPartPresenter,
    APP_TYPES.SecondPartPresenter,
    APP_TYPES.ThirdPartPresenter
  ],
  preInit: (appContainer) => {
    appContainer.bind(APP_TYPES.Renderer).to(Renderer).inSingletonScope();
    appContainer.bind(APP_TYPES.BucketRenderer).to(BucketRenderer).inSingletonScope();
    appContainer.bind(APP_TYPES.ResizeRenderer).to(ResizeRenderer).inSingletonScope();
    appContainer.bind(APP_TYPES.Ticker).toConstantValue(new Ticker({ ignoreFocusOff: true }));

    appContainer.bind(APP_TYPES.AppFlowModel).to(AppFlowModel).inSingletonScope();

    appContainer.bind(APP_TYPES.MainMenuPresenter).to(MainMenuPresenter).inSingletonScope();
    appContainer.bind(APP_TYPES.TopMenuPresenter).to(TopMenuPresenter).inSingletonScope();
    appContainer.bind(APP_TYPES.FirstPartPresenter).to(FirstPartPresenter).inSingletonScope();
    appContainer.bind(APP_TYPES.SecondPartPresenter).to(SecondPartPresenter).inSingletonScope();
    appContainer.bind(APP_TYPES.ThirdPartPresenter).to(ThirdPartPresenter).inSingletonScope();
  },
  onInit: (appContainer) =>
    new Promise<void>((resolve) => {
      const appViewContainer = new AppView();
      appViewContainer
        .initialize()
        .then(() => {
          const { menuView, topMenuView, firstPartView, secondPartView, thirdPartView } = appViewContainer;

          appContainer.bind(APP_TYPES.MainMenuView).toConstantValue(menuView);
          appContainer.bind(APP_TYPES.TopMenuView).toConstantValue(topMenuView);
          appContainer.bind(APP_TYPES.FirstPartView).toConstantValue(firstPartView);
          appContainer.bind(APP_TYPES.SecondPartView).toConstantValue(secondPartView);
          appContainer.bind(APP_TYPES.ThirdPartView).toConstantValue(thirdPartView);
        })
        .then(() => {
          appContainer.get<Renderer>(APP_TYPES.Renderer).addContainer(appViewContainer);
        })
        .then(() => {
          appContainer.get<EventBus>(APP_TYPES.EventBus).emit('Ready');
          resolve();
        });
    }),
  pushToGarbage: [
    APP_TYPES.Renderer,
    APP_TYPES.BucketRenderer,
    APP_TYPES.ResizeRenderer,
    APP_TYPES.Ticker,
    APP_TYPES.AppFlowModel,
    APP_TYPES.MainMenuPresenter,
    APP_TYPES.TopMenuPresenter,
    APP_TYPES.FirstPartPresenter,
    APP_TYPES.SecondPartPresenter,
    APP_TYPES.ThirdPartPresenter
  ],
  onDestroy: (appContainer) => {
    const view = appContainer.get<AppView>(APP_TYPES.AppView);
    view.destroy();
  }
};

export function bootstrapApp(): void {
  new BuildModuleLoader(appConfig);
}
