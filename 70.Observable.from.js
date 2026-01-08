/**
 * This is a follow-up on 57. create an Observable.

Suppose you have solved 57. create an Observable, here you are asked to implement a creation operator from().

From the document, from()

Creates an Observable from an Array, an array-like object, a Promise, an iterable object, or an Observable-like object.

Your from() should accept all above types.

from([1,2,3]).subscribe(console.log);
// 1
// 2
// 3
Note

Observable is already given for you, no need to create it.
for the problem here, Observable-like means Observable instance. Though in real-world you should check Symbol.observable
 */

// Add the static from method to the existing Observable class
Observable.from = function (input) {
    // Validate input immediately and throw error if invalid
    if (input == null) {
        throw new Error("Input cannot be null or undefined");
    }

    // Check if input is a valid type
    const isValidType =
        input instanceof Observable ||
        input instanceof Promise ||
        Array.isArray(input) ||
        (input && typeof input.length === "number" && input.length >= 0) ||
        (input && typeof input[Symbol.iterator] === "function");

    if (!isValidType) {
        throw new Error("Invalid input for Observable.from()");
    }

    return new Observable((subscriber) => {
        // Handle Observable-like objects (Observable instances)
        if (input instanceof Observable) {
            return input.subscribe(subscriber);
        }

        // Handle Promises
        if (input instanceof Promise) {
            input
                .then((value) => {
                    subscriber.next(value);
                    subscriber.complete();
                })
                .catch((error) => {
                    subscriber.error(error);
                });
            return;
        }

        // Handle arrays and array-like objects
        if (
            Array.isArray(input) ||
            (input && typeof input.length === "number" && input.length >= 0)
        ) {
            for (let i = 0; i < input.length; i++) {
                subscriber.next(input[i]);
            }
            subscriber.complete();
            return;
        }

        // Handle iterables (including strings, Maps, Sets, etc.)
        if (input && typeof input[Symbol.iterator] === "function") {
            try {
                const iterator = input[Symbol.iterator]();
                let result;
                while (!(result = iterator.next()).done) {
                    subscriber.next(result.value);
                }
                subscriber.complete();
            } catch (error) {
                subscriber.error(error);
            }
            return;
        }
    });
};

// Example usage and test cases:
// Observable.from([1,2,3]).subscribe(console.log);
// 1
// 2
// 3

// Test cases for different input types:
// 1. Array
// Observable.from([1, 2, 3]).subscribe(console.log);

// 2. Array-like object
// Observable.from({0: 'a', 1: 'b', length: 2}).subscribe(console.log);

// 3. String (iterable)
// Observable.from('hello').subscribe(console.log);

// 4. Set (iterable)
// Observable.from(new Set([1, 2, 3])).subscribe(console.log);

// 5. Promise
// Observable.from(Promise.resolve('resolved')).subscribe(console.log);

// 6. Observable instance
// const obs = new Observable(subscriber => {
//   subscriber.next(1);
//   subscriber.complete();
// });
// Observable.from(obs).subscribe(console.log);

// Test cases
if (typeof module !== "undefined" && module.exports) {
    module.exports = { Observable };
}
