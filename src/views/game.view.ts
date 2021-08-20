import { GarbageBag, createSprites, unwrap } from '../utils';

import { MenuView, ButtonState } from './menu.view';
import { TopMenuView } from './top-menu.view';
import { FirstPartView } from './first-part.view';
import { SecondPartView } from './second-part.view';
import { ThirdPartView } from './third-part.view';

export class GameViewImpl extends PIXI.Container {
    readonly name: string = 'game-view';
    private readonly _garbageBag = new GarbageBag();
    private _menuView: MenuView | undefined;
    private _topMenuView: TopMenuView | undefined;
    private _firstPartView: FirstPartView | undefined;
    private _secondPartView: SecondPartView | undefined;
    private _thirdPartView: ThirdPartView | undefined;
    private _renderer: PIXI.Renderer | undefined;

    initialize(): Promise<void> {
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

        return new Promise(resolve => {
            createSprites();
            const rendererOptions = {
                width: this.width,
                height: this.height
            };
            this._renderer = new PIXI.Renderer(rendererOptions);
            this._menuView = new MenuView();
            this._topMenuView = new TopMenuView();
            this._firstPartView = new FirstPartView();
            this._secondPartView = new SecondPartView();
            this._thirdPartView = new ThirdPartView();

            const { choseMenu$ } = this._menuView;
            const { backToMenuPage$, startAnimation$ } = this._topMenuView;
            const { stateStartButton } = this._firstPartView;

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

            this._garbageBag.completable$(choseMenu$).subscribe(value => {
                this.clickOnButton(value);
                this.menuView.hide();
                this.topMenuView.show(value);
            });

            this._garbageBag.completable$(backToMenuPage$).subscribe(value => {
                this.menuView.show();
                this.topMenuView.hide();
                this.hideViewCall(value);
            });

            this._garbageBag.completable$(startAnimation$).subscribe(value => this.startAnimationCall(value));

            this._garbageBag.completable$(stateStartButton).subscribe(value => this.topMenuView.setStartStateButton(value));
            // const resize$ = merge(
            //     fromEvent(window, 'resize'),
            //     fromEvent(window, 'orientationchange'))
            //     .pipe(debounceTime(200))
            //
            // this._garbageBag.completable$(resize$).subscribe(() => {
            //     this.resize();
            // })
            resolve();
        });
    }

    hideViewCall(buttonName: ButtonState): void {
        switch (buttonName) {
            case ButtonState.FIRST_MENU_BUTTON:
                this.firstPartView.hide();
                break;
            case ButtonState.SECOND_MENU_BUTTON:
                this.secondPartView.hide();
                break;
            case ButtonState.THIRD_MENU_BUTTON:
                this.thirdPartView.hide();
                break;
        }
    }

    startAnimationCall(buttonName: ButtonState): void {
        switch (buttonName) {
            case ButtonState.FIRST_MENU_BUTTON:
                this.firstPartView.clickPlayButton();
                break;
            case ButtonState.SECOND_MENU_BUTTON:
                this.secondPartView.clickPlayButton();
                break;
            case ButtonState.THIRD_MENU_BUTTON:
                this.thirdPartView.clickPlayButton();
                break;
        }
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

    // private resize (): void {
    //     const width = window.innerWidth;
    //     const height = window.innerHeight;
    //     if(this._renderer) {
    //         this._renderer.resize(width, height);
    //     }
    //
    //         const viewport = document.querySelector('meta[name=viewport]');
    //         if (viewport) {
    //             viewport.setAttribute(
    //                 'content',
    //                 'width=' +
    //                 width +
    //                 ', height=' +
    //                 height +
    //                 ', viewport-fit=cover, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=0, minimal-ui'
    //             );
    //         }
    // };

    get menuView(): MenuView {
        return unwrap(this._menuView, 'this._menuView is undefined');
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
