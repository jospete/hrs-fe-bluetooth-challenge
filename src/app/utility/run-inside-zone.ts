import { MonoTypeOperatorFunction, Observable, tap } from "rxjs";

export interface NgZoneLike {
    run<T>(action: () => T): T;
}

export function runInsideZone<T>(zone: NgZoneLike): MonoTypeOperatorFunction<T> {
    return source => new Observable<T>(subscriber => source.subscribe({
        next: value => zone.run(() => subscriber.next(value)),
        error: err => zone.run(() => subscriber.error(err)),
        complete: () => zone.run(() => subscriber.complete())
    }));
}