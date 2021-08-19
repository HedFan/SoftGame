import { GarbageBag, createSprites, unwrap } from '../utils';

import { MenuView, ButtonState } from './menu.view';
import { FirstPartView } from './first-part.view';

export class GameViewImpl extends PIXI.Container {
    readonly name: string = 'game-container';
    private readonly _garbageBag = new GarbageBag();
    private _menuView: MenuView | undefined;
    private _firstPartView: FirstPartView | undefined;

    initialize(
    ): Promise<void> {
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

        return new Promise(resolve => {
            createSprites();
            this._menuView = new MenuView();
            this._firstPartView = new FirstPartView();

            const menuView = this._menuView;
            const firstPartView = this._firstPartView;

            const { choseMenu$ } = menuView;
            const { backToMenuPage$ } = firstPartView;


            this.addChild(this.menuView);
            this.addChild(this.firstPartView);

            this._garbageBag.add(this.menuView);
            this._garbageBag.add(this.firstPartView);

            this._garbageBag
                .completable$(choseMenu$)
                .subscribe((value) => {
                    this.clickOnButton(value);
                    menuView.hide();
                });

            this._garbageBag
                .completable$(backToMenuPage$)
                .subscribe(() => {
                    menuView.show();
                    firstPartView.hide();
                });

            resolve();
        })
    }

    clickOnButton(buttonName: ButtonState): void {
        switch (buttonName) {
            case ButtonState.FIRST_MENU_BUTTON:
                console.log('first');
                if(this._firstPartView){
                    this._firstPartView.show();
                }
                break
            case ButtonState.SECOND_MENU_BUTTON:
                console.log('second');
                break
            case ButtonState.THIRD_MENU_BUTTON:
                console.log('third');
                break
        }
    }

    get menuView(): MenuView {
        return unwrap(this._menuView, 'this._menuView is undefined');
    }

    get firstPartView(): FirstPartView {
        return unwrap(this._firstPartView, 'this._firstPartView is undefined');
    }
}
