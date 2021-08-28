import { filter } from 'rxjs/operators';
import { injectable, inject, postConstruct } from 'inversify';

import { APP_TYPES } from '../types';
import { AppFlowModel, ButtonAction, ButtonState } from '../model';
import { GarbageBag, GarbageCollect } from '../components';
import { TopMenuView } from '../views';

@injectable()
export class TopMenuPresenter implements GarbageCollect {
  protected readonly _garbageBag = new GarbageBag();

  constructor(
    @inject(APP_TYPES.AppFlowModel)
    private readonly _appFlowModel: AppFlowModel,
    @inject(APP_TYPES.TopMenuView)
    private readonly _topMenuView: TopMenuView
  ) {}

  cleanGarbageCollect(): void {
    this._garbageBag.cleanGarbageCollect();
  }

  @postConstruct()
  onInitialize(): void {
    const { action$ } = this._appFlowModel;
    const { backToMenuPage$, startAnimation$ } = this._topMenuView;

    this._garbageBag
      .completable$(backToMenuPage$)
      .subscribe(({ state, action }) => this._appFlowModel.updateAction(state, action));

    this._garbageBag
      .completable$(startAnimation$)
      .subscribe(({ state, action }) => this._appFlowModel.updateAction(state, action));

    this._garbageBag
      .completable$(action$)
      .pipe(filter(({ state }) => state === ButtonState.ACTIVE || state === ButtonState.UN_ACTIVE))
      .subscribe(({ state }) => {
        const stateValue = state === ButtonState.ACTIVE;
        this._topMenuView.setStartStateButton(stateValue);
      });

    this._garbageBag
      .completable$(action$)
      .pipe(filter(({ action }) => action === ButtonAction.SHOW_VIEW || action === ButtonAction.HIDE_VIEW))
      .subscribe(({ state, action }) => {
        if (action === ButtonAction.SHOW_VIEW) {
          this._topMenuView.show(state);
        } else {
          this._topMenuView.hide();
        }
      });
  }
}
