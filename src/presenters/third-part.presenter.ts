import { injectable, inject, postConstruct } from 'inversify';
import { filter } from 'rxjs/operators';

import { APP_TYPES } from '../types';
import { AppFlowModel, ButtonAction, ButtonState } from '../model';
import { GarbageBag, GarbageCollect } from '../components';
import { ThirdPartView } from '../views';

@injectable()
export class ThirdPartPresenter implements GarbageCollect {
  protected readonly _garbageBag = new GarbageBag();

  constructor(
    @inject(APP_TYPES.AppFlowModel)
    private readonly _appFlowModel: AppFlowModel,
    @inject(APP_TYPES.ThirdPartView)
    private readonly _thirdPartView: ThirdPartView
  ) {}

  cleanGarbageCollect(): void {
    this._garbageBag.cleanGarbageCollect();
  }

  @postConstruct()
  onInitialize(): void {
    const { action$ } = this._appFlowModel;

    this._garbageBag
      .completable$(action$)
      .pipe(filter(({ state, action }) => action === ButtonAction.SHOW_VIEW && state === ButtonState.THIRD_MENU_BUTTON))
      .subscribe(() => this._thirdPartView.show());

    this._garbageBag
      .completable$(action$)
      .pipe(filter(({ state, action }) => action === ButtonAction.HIDE_VIEW && state === ButtonState.THIRD_MENU_BUTTON))
      .subscribe(() => this._thirdPartView.hide());

    this._garbageBag
      .completable$(action$)
      .pipe(
        filter(
          ({ state, action }) => action === ButtonAction.START_ANIMATION && state === ButtonState.THIRD_MENU_BUTTON
        )
      )
      .subscribe(() => this._thirdPartView.clickPlayButton());
  }
}
