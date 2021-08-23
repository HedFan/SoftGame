import { Subject, fromEvent, merge, Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';

import { ButtonState, ButtonAction } from '../model';
import { GarbageBag, GarbageCollect } from '../components';
import { fromCacheAsTexture } from '../utils';

export class MainMenuView extends PIXI.Container implements GarbageCollect {
  readonly name = 'main-menu-container';
  private readonly _garbageBag = new GarbageBag();
  private readonly _firstMenuButton: PIXI.Sprite;
  private readonly _secondMenuButton: PIXI.Sprite;
  private readonly _thirdMenuButton: PIXI.Sprite;
  private readonly _buttonContainer = new PIXI.Container();
  private readonly _choseMenuSubject$ = new Subject<{ state: ButtonState; action: ButtonAction }>();

  constructor() {
    super();

    this._buttonContainer.position.set(100, 50);

    const textFirst = fromCacheAsTexture('number-1');
    const textSecond = fromCacheAsTexture('number-2');
    const textThird = fromCacheAsTexture('number-3');

    this._firstMenuButton = new PIXI.Sprite(textFirst);
    this._firstMenuButton.interactive = true;
    this._firstMenuButton.buttonMode = true;
    this._firstMenuButton.hitArea = new PIXI.Rectangle(0, 0, 30, 30);

    this._secondMenuButton = new PIXI.Sprite(textSecond);
    this._secondMenuButton.interactive = true;
    this._secondMenuButton.buttonMode = true;
    this._secondMenuButton.hitArea = new PIXI.Rectangle(0, 0, 30, 30);
    this._secondMenuButton.y = 90;

    this._thirdMenuButton = new PIXI.Sprite(textThird);
    this._thirdMenuButton.interactive = true;
    this._thirdMenuButton.buttonMode = true;
    this._thirdMenuButton.hitArea = new PIXI.Rectangle(0, 0, 30, 30);
    this._thirdMenuButton.y = 180;

    const clickButton$ = merge(
      fromEvent(this._firstMenuButton, 'pointerdown').pipe(
        mapTo({ state: ButtonState.FIRST_MENU_BUTTON, action: ButtonAction.SHOW_VIEW })
      ),
      fromEvent(this._secondMenuButton, 'pointerdown').pipe(
        mapTo({ state: ButtonState.SECOND_MENU_BUTTON, action: ButtonAction.SHOW_VIEW })
      ),
      fromEvent(this._thirdMenuButton, 'pointerdown').pipe(
        mapTo({ state: ButtonState.THIRD_MENU_BUTTON, action: ButtonAction.SHOW_VIEW })
      )
    );

    this._buttonContainer.addChild(this._firstMenuButton);
    this._buttonContainer.addChild(this._secondMenuButton);
    this._buttonContainer.addChild(this._thirdMenuButton);
    this.addChild(this._buttonContainer);

    this._garbageBag.completable$(clickButton$).subscribe((value) => {
      this._choseMenuSubject$.next(value);
    });
  }

  cleanGarbageCollect(): void {
    this._garbageBag.cleanGarbageCollect();
  }

  hide(): void {
    this.visible = false;
  }

  show(): void {
    this.visible = true;
  }

  get choseMenu$(): Observable<{ state: ButtonState; action: ButtonAction }> {
    return this._choseMenuSubject$;
  }
}
