import { GarbageBag, createSprites, unwrap } from '../utils';

import { MenuView, ButtonState } from './menu.view';
import { FirstPartView } from './first-part.view';
import { SecondPartView } from './second-part.view';

export class GameViewImpl extends PIXI.Container {
    readonly name: string = 'game-container';
    private readonly _garbageBag = new GarbageBag();
    private _menuView: MenuView | undefined;
    private _firstPartView: FirstPartView | undefined;
    private _secondPartView: SecondPartView | undefined;

    initialize(): Promise<void> {
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

        return new Promise(resolve => {
            createSprites();
            this._menuView = new MenuView();
            this._firstPartView = new FirstPartView();
            this._secondPartView = new SecondPartView();

            const { choseMenu$ } = this._menuView;
            const { backToMenuPage$ } = this._firstPartView;
            const { backToMenuPageSecond$ } = this._secondPartView;

            this.addChild(this.menuView);
            this.addChild(this.firstPartView);
            this.addChild(this.secondPartView);

            this._garbageBag.add(this.menuView);
            this._garbageBag.add(this.firstPartView);
            this._garbageBag.add(this.secondPartView);

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

            resolve();
        });
    }

    clickOnButton(buttonName: ButtonState): void {
        switch (buttonName) {
            case ButtonState.FIRST_MENU_BUTTON:
                console.log('first');
                this.firstPartView.show();
                break;
            case ButtonState.SECOND_MENU_BUTTON:
                console.log('second');
                this.secondPartView.show();
                break;
            case ButtonState.THIRD_MENU_BUTTON:
                console.log('third');
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
}
