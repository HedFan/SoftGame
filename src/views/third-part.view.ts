import { Subject, fromEvent, Observable } from 'rxjs';

import { GarbageBag, GarbageCollect, createButton } from '../utils';

export class ThirdPartView extends PIXI.Container implements GarbageCollect {
    readonly name = 'third-part-vew';
    private readonly _garbageBag = new GarbageBag();
    private readonly _startButton: PIXI.Sprite;
    private readonly _homeButton: PIXI.Sprite;
    private readonly _backToMenuPageSubject$ = new Subject<void>();
    private readonly _simpleText: PIXI.Text;

    constructor() {
        super();
        this.visible = false;

        this._startButton = createButton('start-button', 130, 49);
        this._startButton.position.set(120, 10);
        const clickButton$ = fromEvent(this._startButton, 'pointerdown');

        this._homeButton = createButton('home-button', 49, 49);
        this._homeButton.position.set(300, 10);
        const clickHomeButton$ = fromEvent(this._homeButton, 'pointerdown');

        this._simpleText = new PIXI.Text('Sorry, but I have nothing here 😐', { fill: 0xffffff, fontSize: 20 });
        this._simpleText.position.set(60, 90);
        this._simpleText.visible = false;

        this.addChild(this._startButton);
        this.addChild(this._homeButton);
        this.addChild(this._simpleText);

        this._garbageBag.completable$(clickButton$).subscribe(() => this.clickPlayButton());

        this._garbageBag.completable$(clickHomeButton$).subscribe(() => this._backToMenuPageSubject$.next());
    }

    cleanGarbageCollect(): void {
        this._garbageBag.cleanGarbageCollect();
    }

    show(): void {
        this.visible = true;
    }

    hide(): void {
        this.visible = false;
        this._simpleText.visible = false;
    }

    private clickPlayButton(): void {
        this._simpleText.visible = true;
    }

    get backToMenuPageThird$(): Observable<void> {
        return this._backToMenuPageSubject$;
    }
}
