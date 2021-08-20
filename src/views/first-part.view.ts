import { Subject, fromEvent, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Tween } from '@tweenjs/tween.js';

import { GarbageBag, GarbageCollect, getRandom, repeat, fromCacheAsSprite, createButton } from '../utils';

const TWEEN = require('@tweenjs/tween.js');
const Stats = require('stats-js');

const cardsQuantity = 144;

interface Coordinates {
    x: number;
    y: number;
}

export class FirstPartView extends PIXI.Container implements GarbageCollect {
    readonly name = 'first-part-vew';
    private readonly _garbageBag = new GarbageBag();
    private readonly _playCardsContainer = new PIXI.Container();
    private readonly _startButton: PIXI.Sprite;
    private readonly _homeButton: PIXI.Sprite;
    private readonly _tweenGroup = new TWEEN.Group();
    private readonly _completeOpenAnimationSubject$ = new Subject<void>();
    private readonly _backToMenuPageSubject$ = new Subject<void>();
    private readonly _stats = new Stats();
    private _timeout: NodeJS.Timeout | undefined;
    private _isPlayFlag: boolean = false;
    private _playCards = new Array<PIXI.Sprite>();
    private _requestAnimation: number | undefined;
    private _statsRequestAnimation: number | undefined;
    private _stateRunning: boolean = true;
    private _animationRunning: boolean = true;
    private _cardsAlreadyBuild: boolean = true;

    constructor() {
        super();
        this.visible = false;
        this.buildCards();
        this._playCardsContainer.position.set(10, 80);
        this._playCardsContainer.sortableChildren = true;

        const { dom } = this._stats;
        document.body.appendChild(dom);
        this._stats.showPanel(0);

        this._startButton = createButton('start-button', 130, 49);
        this._startButton.position.set(120, 10);
        const clickButton$ = fromEvent(this._startButton, 'pointerdown');

        this._homeButton = createButton('home-button', 49, 49);
        this._homeButton.position.set(300, 10);
        const clickHomeButton$ = fromEvent(this._homeButton, 'pointerdown');

        this.addChild(this._playCardsContainer);
        this.addChild(this._startButton);
        this.addChild(this._homeButton);

        this._garbageBag
            .completable$(this._completeOpenAnimationSubject$)
            .pipe(delay(2000))
            .subscribe(() => {
                this.buildAnimation(true);
                this.startAnimation().then(() => {
                    this._isPlayFlag = false;
                    this._startButton.interactive = true;
                });
            });

        this._garbageBag.completable$(clickButton$).subscribe(() => this.clickPlayButton());

        this._garbageBag.completable$(clickHomeButton$).subscribe(() => this._backToMenuPageSubject$.next());

        this._garbageBag.add(this._stats);
    }

    cleanGarbageCollect(): void {
        this._garbageBag.cleanGarbageCollect();
        this._tweenGroup.removeAll();
        this.cancelAnimationListener();
        this.cancelStatsListener();
    }

    show(): void {
        if (!this._playCards.length && !this._playCardsContainer.children.length) {
            this.buildCards();
        }
        this.visible = true;
        this._statsRequestAnimation = requestAnimationFrame(this.statsAnimate);
        this._stateRunning = true;
        this._startButton.interactive = true;
        this._animationRunning = true;
        this._isPlayFlag = false;
    }

    hide(): void {
        this.visible = false;
        this.cancelAnimationListener();
        this.cancelStatsListener();
        this._tweenGroup.removeAll();
        if (!this._cardsAlreadyBuild) {
            this._playCards = [];
            this._playCardsContainer.removeChildren();
        }
        if (this._timeout) {
            clearTimeout(this._timeout);
        }
    }

    private clickPlayButton(): void {
        if (this._isPlayFlag) {
            return;
        }
        this.buildAnimation(false);
        this.startAnimation().then(() => this._completeOpenAnimationSubject$.next());
    }

    private startAnimation(): Promise<void> {
        this._isPlayFlag = true;
        this._animationRunning = true;
        this._cardsAlreadyBuild = false;
        this._startButton.interactive = false;
        this._requestAnimation = requestAnimationFrame(this.cardAnimate);
        return new Promise<void>(resolve => {
            const tweenArray = this._tweenGroup.getAll();
            return this.runTween(tweenArray).then(() => {
                this._playCards.reverse();
                resolve();
            });
        });
    }

    private runTween(tweenArray: Array<Tween<PIXI.Sprite>>, index: number = cardsQuantity - 1): Promise<void> {
        if (index < 0) {
            return Promise.resolve();
        }
        return new Promise(resolve => {
            this._timeout = setTimeout(() => {
                tweenArray[index].start();
                return this.runTween(tweenArray, index - 1).then(() => resolve());
            }, 1000);
        });
    }

    private buildAnimation(isReverse = false): Promise<void> {
        this._tweenGroup.removeAll();
        const isReversIndex = isReverse ? -1 : 1;
        const playCards = this._playCards;
        return new Promise<void>(resolve => {
            playCards.forEach((sprite, index) => {
                const orderIndex = cardsQuantity - index;
                const xCoordinate = orderIndex * 5;
                const newCoordinates = { x: xCoordinate, y: sprite.y + 200 * isReversIndex };
                const onComplete = () => resolve();
                const tweenCard = this.tweenAnimation(newCoordinates, sprite, orderIndex, onComplete);
                this._tweenGroup.add(tweenCard);
            });
        });
    }

    private tweenAnimation(
        to: Coordinates,
        owner: PIXI.Sprite,
        orderIndex: number,
        onComplete: () => void,
        duration: number = 2000
    ): Tween<PIXI.Sprite> {
        return new TWEEN.Tween(owner)
            .to({ x: to.x, y: to.y }, duration)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(({ y, x }: { x: number; y: number }) => {
                owner.zIndex = orderIndex;
                owner.x = x;
                owner.y = y;
            })
            .onComplete(() => onComplete());
    }

    private buildCards(): void {
        this._cardsAlreadyBuild = true;
        repeat(cardsQuantity).map(value => {
            const numberOfCard = getRandom(0, 52);
            const card = fromCacheAsSprite('card-' + numberOfCard);
            card.x = value * 5;
            const scaleSet = Math.min(window.innerWidth / 1000, 1);
            card.scale.set(scaleSet);
            this._playCards.push(card);
            this._playCardsContainer.addChild(card);
        });
    }

    private cancelAnimationListener(): void {
        this._animationRunning = false;
        if (this._requestAnimation !== undefined) {
            cancelAnimationFrame(this._requestAnimation);
        }
    }

    private cancelStatsListener(): void {
        this._stateRunning = false;
        if (this._statsRequestAnimation !== undefined) {
            cancelAnimationFrame(this._statsRequestAnimation);
        }
    }

    private readonly statsAnimate = () => {
        if (!this._stateRunning) {
            return;
        }
        this._stats.begin();
        this._stats.end();
        requestAnimationFrame(this.statsAnimate);
    };

    private readonly cardAnimate = (time: number) => {
        if (!this._animationRunning) {
            return;
        }
        TWEEN.update(time);
        requestAnimationFrame(this.cardAnimate);
    };

    get backToMenuPage$(): Observable<void> {
        return this._backToMenuPageSubject$;
    }
}
