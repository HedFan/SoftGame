import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
type GarbageBagType = () => void;

export interface GarbageCollect {
    cleanGarbageCollect(): void;
}

function isGarbageCollect(object: any): object is GarbageCollect {
    return 'cleanGarbageCollect' in object && typeof object['cleanGarbageCollect'] === 'function';
}

export class GarbageBag implements GarbageCollect {
    private readonly _garbageBagSubject$ = new Subject<void>();
    private readonly _list = new Set<GarbageBagType>();
    private _isGarbageBagRun = true;

    add(item: GarbageCollect | GarbageBagType): void {
        if (typeof item === 'function') {
            this._list.add(() => item());
        } else if (isGarbageCollect(item)) {
            this._list.add(() => item.cleanGarbageCollect());
        } else {
           console.log(`${item} doesn't contain this method`);
        }
    }

    completable$<T>(item$: Observable<T>): Observable<T> {
        return item$.pipe(takeUntil(this._garbageBagSubject$));
    }

    cleanGarbageCollect(): void {
        this._garbageBagSubject$.next();
        this._garbageBagSubject$.complete();

        this._list.forEach(cb => cb());
        this._list.clear();
        this._isGarbageBagRun = false;
    }
}
