// A tiny scheduler: prefer microtasks if available
const asyncRun =
    typeof queueMicrotask === "function"
        ? queueMicrotask
        : (fn) => setTimeout(fn, 0);

const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

class MyPromise {
    constructor(executor) {
        this._state = PENDING;
        this._value = undefined;
        this._onFulfilled = [];
        this._onRejected = [];

        const resolve = (value) => this._resolve(value);
        const reject = (reason) => this._reject(reason);

        try {
            executor(resolve, reject);
        } catch (err) {
            reject(err);
        }
    }

    // Thenable assimilation + self-resolution protection
    _resolve(x) {
        if (this._state !== PENDING) return;
        if (x === this) {
            return this._reject(
                new TypeError("Chaining cycle detected for promise")
            );
        }

        // If x is a MyPromise, adopt its state
        if (x instanceof MyPromise) {
            return x.then(
                (v) => this._resolve(v),
                (r) => this._reject(r)
            );
        }

        // If x is thenable (i.e., has a .then), adopt it
        if (x !== null && (typeof x === "object" || typeof x === "function")) {
            let called = false;
            try {
                const then = x.then;
                if (typeof then === "function") {
                    return then.call(
                        x,
                        (y) => {
                            if (called) return;
                            called = true;
                            this._resolve(y);
                        },
                        (r) => {
                            if (called) return;
                            called = true;
                            this._reject(r);
                        }
                    );
                }
            } catch (err) {
                if (!called) this._reject(err);
                return;
            }
        }

        // Otherwise, fulfill with value
        this._fulfill(x);
    }

    _fulfill(value) {
        if (this._state !== PENDING) return;
        this._state = FULFILLED;
        this._value = value;
        this._drain();
    }

    _reject(reason) {
        if (this._state !== PENDING) return;
        this._state = REJECTED;
        this._value = reason;
        this._drain();
    }

    _drain() {
        const queue =
            this._state === FULFILLED ? this._onFulfilled : this._onRejected;
        while (queue.length) {
            const fn = queue.shift();
            // fn will schedule the actual handler via asyncRun
            fn();
        }
    }

    then(onFulfilled, onRejected) {
        const self = this;
        const realOnFulfilled =
            typeof onFulfilled === "function" ? onFulfilled : (v) => v;
        const realOnRejected =
            typeof onRejected === "function"
                ? onRejected
                : (e) => {
                      throw e;
                  };

        let promise2;
        promise2 = new MyPromise((resolve, reject) => {
            const fulfilledTask = () => {
                asyncRun(() => {
                    try {
                        const x = realOnFulfilled(self._value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (err) {
                        reject(err);
                    }
                });
            };

            const rejectedTask = () => {
                asyncRun(() => {
                    try {
                        const x = realOnRejected(self._value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (err) {
                        reject(err);
                    }
                });
            };

            if (self._state === FULFILLED) {
                fulfilledTask();
            } else if (self._state === REJECTED) {
                rejectedTask();
            } else {
                self._onFulfilled.push(fulfilledTask);
                self._onRejected.push(rejectedTask);
            }
        });

        return promise2;
    }

    catch(onRejected) {
        return this.then(undefined, onRejected);
    }

    static resolve(value) {
        if (value instanceof MyPromise) return value;
        return new MyPromise((resolve) => resolve(value));
    }

    static reject(reason) {
        return new MyPromise((_, reject) => reject(reason));
    }
}

// Promises/A+ resolution procedure for then-chains
function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject(new TypeError("Chaining cycle detected for promise"));
    }
    if (x !== null && (typeof x === "object" || typeof x === "function")) {
        let called = false;
        try {
            const then = x.then;
            if (typeof then === "function") {
                return then.call(
                    x,
                    (y) => {
                        if (called) return;
                        called = true;
                        resolvePromise(promise2, y, resolve, reject);
                    },
                    (r) => {
                        if (called) return;
                        called = true;
                        reject(r);
                    }
                );
            }
        } catch (err) {
            if (!called) return reject(err);
            return;
        }
    }
    resolve(x);
}
// 1) Basic async scheduling
const p = new MyPromise((resolve) => resolve(1));
p.then((v) => console.log("then:", v));
console.log("sync"); // logs "sync" first, then "then: 1"

// 2) Chaining
MyPromise.resolve(2)
    .then((v) => v * 2)
    .then((v) => new MyPromise((res) => setTimeout(() => res(v + 1), 10)))
    .then((v) => console.log("chain result:", v)); // 5

// 3) Rejection + catch
MyPromise.reject(new Error("boom"))
    .catch((e) => "handled: " + e.message)
    .then((v) => console.log(v)); // "handled: boom"

// 4) Static resolve / reject
MyPromise.resolve(42).then(console.log); // 42
MyPromise.reject("nope").catch(console.error); // "nope"

/**
 * Notes

then handlers are guaranteed to run asynchronously via queueMicrotask (or setTimeout fallback).
Properly handles thenables, errors thrown in executors/handlers, and cycle detection.
If you want to extend this later, adding finally, all, race, and allSettled is straightforward on top of this foundation.
 */
