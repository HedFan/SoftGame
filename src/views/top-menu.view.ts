import { Subject, fromEvent, Observable } from 'rxjs';

import { GarbageBag, GarbageCollect, createButton } from '../utils';

import { ButtonState } from './menu.view';

export class TopMenuView extends PIXI.Container implements GarbageCollect {
    readonly name = 'top-menu-view';
    private readonly _garbageBag = new GarbageBag();
    private readonly _backToMenuPageSubject$ = new Subject<ButtonState>();
    private readonly _startAnimationSubject$ = new Subject<ButtonState>();
    private readonly _startButton: PIXI.Sprite;
    private readonly _homeButton: PIXI.Sprite;
    private _currentPage: ButtonState | undefined;

    constructor() {
        super();
        this.visible = false;

        this._startButton = createButton('start-button', 130, 49);
        this._startButton.position.set(120, 10);
        const clickButton$ = fromEvent(this._startButton, 'pointerdown');

        this._homeButton = createButton('home-button', 49, 49);
        this._homeButton.position.set(300, 10);
        const clickHomeButton$ = fromEvent(this._homeButton, 'pointerdown');

        this.addChild(this._startButton);
        this.addChild(this._homeButton);

        this._garbageBag.completable$(clickButton$).subscribe(() => {
            if (this._currentPage) {
                this._startAnimationSubject$.next(this._currentPage);
            }
        });

        this._garbageBag.completable$(clickHomeButton$).subscribe(() => {
            if (this._currentPage) {
                this._backToMenuPageSubject$.next(this._currentPage);
            }
        });
    }

    cleanGarbageCollect(): void {
        this._garbageBag.cleanGarbageCollect();
    }

    show(value: ButtonState): void {
        this.visible = true;
        this._currentPage = value;
        this._startButton.interactive = true;
    }

    hide(): void {
        this.visible = false;
        this._startButton.interactive = false;
    }

    setStartStateButton(value: boolean): void {
        this._startButton.interactive = value;
    }

    get backToMenuPage$(): Observable<ButtonState> {
        return this._backToMenuPageSubject$;
    }

    get startAnimation$(): Observable<ButtonState> {
        return this._startAnimationSubject$;
    }
}
