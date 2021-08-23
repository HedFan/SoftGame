import { injectable, inject, postConstruct } from 'inversify';

import { APP_TYPES } from '../types';
import { AppFlowModel, ButtonAction } from '../model';
import { GarbageBag, GarbageCollect } from '../components';
import { MainMenuView } from '../views';
import { filter } from 'rxjs/operators';

@injectable()
export class MainMenuPresenter implements GarbageCollect {
  protected readonly _garbageBag = new GarbageBag();

  constructor(
    @inject(APP_TYPES.AppFlowModel)
    private readonly _appFlowModel: AppFlowModel,
    @inject(APP_TYPES.MainMenuView)
    private readonly _mainMenuView: MainMenuView
  ) {}

  cleanGarbageCollect(): void {
    this._garbageBag.cleanGarbageCollect();
  }

  @postConstruct()
  onInitialize(): void {
    const { action$ } = this._appFlowModel;
    const { choseMenu$ } = this._mainMenuView;

    this._garbageBag.completable$(choseMenu$).subscribe(({ state, action }) => {
      this._mainMenuView.hide();
      return this._appFlowModel.updateAction(state, action);
    });

    this._garbageBag
      .completable$(action$)
      .pipe(filter(({ action }) => action === ButtonAction.HIDE_VIEW))
      .subscribe(() => this._mainMenuView.show());
  }
}
