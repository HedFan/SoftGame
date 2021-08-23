import { GarbageBag } from '../components';
import { createSprites, unwrap } from '../utils';

import { MainMenuView } from './main-menu.view';
import { TopMenuView } from './top-menu.view';
import { FirstPartView } from './first-part.view';
import { SecondPartView } from './second-part.view';
import { ThirdPartView } from './third-part.view';

export class AppView extends PIXI.Container {
  readonly name: string = 'app-view-container';
  private readonly _garbageBag = new GarbageBag();
  private _mainMenuView: MainMenuView | undefined;
  private _topMenuView: TopMenuView | undefined;
  private _firstPartView: FirstPartView | undefined;
  private _secondPartView: SecondPartView | undefined;
  private _thirdPartView: ThirdPartView | undefined;

  initialize(): Promise<void> {
    return new Promise((resolve) => {
      createSprites();
      this._mainMenuView = new MainMenuView();
      this._topMenuView = new TopMenuView();
      this._firstPartView = new FirstPartView();
      this._secondPartView = new SecondPartView();
      this._thirdPartView = new ThirdPartView();

      this.addChild(this.menuView);
      this.addChild(this.firstPartView);
      this.addChild(this.secondPartView);
      this.addChild(this.thirdPartView);
      this.addChild(this.topMenuView);

      this._garbageBag.add(this.menuView);
      this._garbageBag.add(this.firstPartView);
      this._garbageBag.add(this.secondPartView);
      this._garbageBag.add(this.thirdPartView);
      this._garbageBag.add(this.topMenuView);

      resolve();
    });
  }

  get menuView(): MainMenuView {
    return unwrap(this._mainMenuView, 'this._mainMenuView is undefined');
  }

  get topMenuView(): TopMenuView {
    return unwrap(this._topMenuView, 'this._topMenuView is undefined');
  }

  get firstPartView(): FirstPartView {
    return unwrap(this._firstPartView, 'this._firstPartView is undefined');
  }

  get secondPartView(): SecondPartView {
    return unwrap(this._secondPartView, 'this._secondPartView is undefined');
  }

  get thirdPartView(): ThirdPartView {
    return unwrap(this._thirdPartView, 'this._thirdPartView is undefined');
  }
}
