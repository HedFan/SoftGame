import { injectable } from 'inversify';
import { Subject, Observable } from 'rxjs';

import { GarbageBag, GarbageCollect } from '../components/garbage-bag';

export declare const enum ButtonAction {
  HIDE_VIEW = 'hide-view',
  SHOW_VIEW = 'show-view',
  START_ANIMATION = 'start-animation'
}

export declare const enum ButtonState {
  ACTIVE = 'active',
  UN_ACTIVE = 'un-active',
  FIRST_MENU_BUTTON = 'first-menu-button',
  SECOND_MENU_BUTTON = 'second-menu-button',
  THIRD_MENU_BUTTON = 'third-menu-button'
}

@injectable()
export class AppFlowModel implements GarbageCollect {
  private readonly _garbageBag = new GarbageBag();
  private readonly _actionSubject$ = new Subject<{ state: ButtonState; action?: ButtonAction }>();

  constructor() {}

  cleanGarbageCollect(): void {
    this._garbageBag.cleanGarbageCollect();
  }

  call(state: ButtonState, action?: ButtonAction): void {
    this._actionSubject$.next({ state, action });
  }

  updateAction(incomeState: ButtonState, incomeAction?: ButtonAction): Promise<void> {
    this.call(incomeState, incomeAction);
    return Promise.resolve();
  }

  get action$(): Observable<{ state: ButtonState; action?: ButtonAction }> {
    return this._actionSubject$;
  }
}
