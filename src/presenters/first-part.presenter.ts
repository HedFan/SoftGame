import { injectable, inject, postConstruct } from 'inversify';
import { filter } from 'rxjs/operators';

import { APP_TYPES } from '../types';
import { AppFlowModel, ButtonAction, ButtonState } from '../model';
import { GarbageBag, GarbageCollect } from '../components';
import { FirstPartView } from '../views';

@injectable()
export class FirstPartPresenter implements GarbageCollect {
  protected readonly _garbageBag = new GarbageBag();

  constructor(
    @inject(APP_TYPES.AppFlowModel)
    private readonly _appFlowModel: AppFlowModel,
    @inject(APP_TYPES.FirstPartView)
    private readonly _firstPartView: FirstPartView
  ) {}

  cleanGarbageCollect(): void {
    this._garbageBag.cleanGarbageCollect();
  }

  @postConstruct()
  onInitialize(): void {
    const { action$ } = this._appFlowModel;
    const { stateStartButton$ } = this._firstPartView;

    this._garbageBag.completable$(stateStartButton$).subscribe((state) => this._appFlowModel.updateAction(state));

    this._garbageBag
      .completable$(action$)
      .pipe(filter(({ state, action }) => action === ButtonAction.SHOW_VIEW && state === ButtonState.FIRST_MENU_BUTTON))
      .subscribe(() => this._firstPartView.show());

    this._garbageBag
      .completable$(action$)
      .pipe(filter(({ state, action }) => action === ButtonAction.HIDE_VIEW && state === ButtonState.FIRST_MENU_BUTTON))
      .subscribe(() => this._firstPartView.hide());

    this._garbageBag
      .completable$(action$)
      .pipe(
        filter(
          ({ state, action }) => action === ButtonAction.START_ANIMATION && state === ButtonState.FIRST_MENU_BUTTON
        )
      )
      .subscribe(() => this._firstPartView.clickPlayButton());
  }
}
