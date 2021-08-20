import { GarbageBag, createSprites, unwrap } from '../utils';

import { MenuView, ButtonState } from './menu.view';
import { FirstPartView } from './first-part.view';
import { SecondPartView } from './second-part.view';
import { ThirdPartView } from './third-part.view';

export class GameViewImpl extends PIXI.Container {
    readonly name: string = 'game-container';
    private readonly _garbageBag = new GarbageBag();
    private _menuView: MenuView | undefined;
    private _firstPartView: FirstPartView | undefined;
    private _secondPartView: SecondPartView | undefined;
    private _thirdPartView: ThirdPartView | undefined;

    initialize(): Promise<void> {
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

        return new Promise(resolve => {
            createSprites();
            this._menuView = new MenuView();
            this._firstPartView = new FirstPartView();
            this._secondPartView = new SecondPartView();
            this._thirdPartView = new ThirdPartView();

            const { choseMenu$ } = this._menuView;
            const { backToMenuPage$ } = this._firstPartView;
            const { backToMenuPageSecond$ } = this._secondPartView;
            const { backToMenuPageThird$ } = this._thirdPartView;

            this.addChild(this.menuView);
            this.addChild(this.firstPartView);
            this.addChild(this.secondPartView);
            this.addChild(this.thirdPartView);

            this._garbageBag.add(this.menuView);
            this._garbageBag.add(this.firstPartView);
            this._garbageBag.add(this.secondPartView);
            this._garbageBag.add(this.thirdPartView);

            this._garbageBag.completable$(choseMenu$).subscribe(value => {
                this.clickOnButton(value);
                this.menuView.hide();
            });

            this._garbageBag.completable$(backToMenuPage$).subscribe(() => {
                this.menuView.show();
                this.firstPartView.hide();
            });

            this._garbageBag.completable$(backToMenuPageSecond$).subscribe(() => {
                this.menuView.show();
                this.secondPartView.hide();
            });

            this._garbageBag.completable$(backToMenuPageThird$).subscribe(() => {
                this.menuView.show();
                this.thirdPartView.hide();
            });

            resolve();
        });
    }

    clickOnButton(buttonName: ButtonState): void {
        switch (buttonName) {
            case ButtonState.FIRST_MENU_BUTTON:
                this.firstPartView.show();
                break;
            case ButtonState.SECOND_MENU_BUTTON:
                this.secondPartView.show();
                break;
            case ButtonState.THIRD_MENU_BUTTON:
                this.thirdPartView.show();
                break;
        }
    }

    get menuView(): MenuView {
        return unwrap(this._menuView, 'this._menuView is undefined');
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
