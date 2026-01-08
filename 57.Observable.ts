/**
 * Have you ever used RxJS before? The most important concept in it is Observable and Observer.
 * Observable defines how values are delivered to Observer. Observer is just a set of callbacks.
 *
 * Example of an Observer:
 * ```typescript
 * const observer = {
 *   next: (value) => {
 *     console.log('we got a value', value)
 *   },
 *   error: (error) => {
 *     console.log('we got an error', error)
 *   },
 *   complete: () => {
 *     console.log('ok, no more values')
 *   }
 * }
 * ```
 *
 * Example of an Observable:
 * ```typescript
 * const observable = new Observable((subscriber) => {
 *   subscriber.next(1)
 *   subscriber.next(2)
 *   setTimeout(() => {
 *     subscriber.next(3)
 *     subscriber.next(4)
 *     subscriber.complete()
 *   }, 100)
 * })
 * ```
 *
 * Requirements:
 * 1. error and complete can only be delivered once
 * 2. next/error/complete after error/complete should not work
 * 3. for a subscriber object, next/error/complete callbacks are optional
 * 4. if a function is passed as observer, it is treated as next
 * 5. should support multiple subscription
 */

type Observer<T> =
    | {
          next?: (value: T) => void;
          error?: (error: any) => void;
          complete?: () => void;
      }
    | ((value: T) => void);

type Subscriber<T> = {
    next: (value: T) => void;
    error: (error: any) => void;
    complete: () => void;
};

class MyObservable<T> {
    private generator: (subscriber: Subscriber<T>) => void;

    constructor(generator: (subscriber: Subscriber<T>) => void) {
        this.generator = generator;
    }

    subscribe(observer: Observer<T>) {
        // Handle case where observer is a function (requirement 4)
        const normalizedObserver: Observer<T> =
            typeof observer === "function" ? { next: observer } : observer;

        let isStopped = false;
        let isComplete = false;

        // Create subscriber with protection against multiple error/complete (requirements 1 & 2)
        const subscriber: Subscriber<T> = {
            next: (value: T) => {
                if (isStopped || !normalizedObserver.next) return;
                normalizedObserver.next(value);
            },
            error: (error: any) => {
                if (isStopped || !normalizedObserver.error) return;
                isStopped = true;
                normalizedObserver.error(error);
            },
            complete: () => {
                if (isStopped || isComplete || !normalizedObserver.complete)
                    return;
                isStopped = true;
                isComplete = true;
                normalizedObserver.complete();
            },
        };

        try {
            // Support multiple subscriptions (requirement 5) by calling generator each time
            this.generator(subscriber);
        } catch (e) {
            subscriber.error(e);
        }

        // Return unsubscribe functionality
        return {
            unsubscribe: () => {
                isStopped = true;
            },
        };
    }
}

class Observable {
    private _setup: any;

    constructor(setup) {
        this._setup = setup;
    }

    subscribe(subscriber) {
        const localObserver =
            typeof subscriber === "function"
                ? { next: subscriber }
                : subscriber;
        let unSubscribed = false;
        let isComplete = false;

        const observer = {
            next: (value) => {
                if (unSubscribed || !localObserver.next) return;
                localObserver.next(value);
            },
            error: (err) => {
                if (unSubscribed || !localObserver.error) return;
                unSubscribed = true;
                localObserver.error(err);
            },
            complete: () => {
                if (unSubscribed || isComplete || !localObserver.complete)
                    return;
                unSubscribed = true;
                isComplete = true;
                localObserver.complete();
            },
        };
        try {
            // Support multiple subscriptions (requirement 5) by calling generator each time
            this._setup(observer);
        } catch (e) {
            observer.error(e);
        }

        return {
            unsubscribe: () => {
                unSubscribed = true;
            },
        };
    }
}

// Example usage:

const observable = new Observable((subscriber) => {
    subscriber.next(1);
    subscriber.next(2);
    setTimeout(() => {
        subscriber.next(3);
        subscriber.next(4);
        subscriber.complete();
    }, 100);
});

const observer = {
    next: (value) => console.log("value:", value),
    error: (error) => console.log("error:", error),
    complete: () => console.log("complete"),
};

observable.subscribe(observer);

export default Observable;
