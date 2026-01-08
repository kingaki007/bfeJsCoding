/**
 * This problem is related to 30. implement async helper - parallel().

You are asked to implement an async function helper, race() which works like Promise.race(). Different from parallel() that waits for all functions to finish, race() will finish when any function is done or run into error.

All async functions have following interface

type Callback = (error: Error, data: any) => void
type AsyncFunc = (
   callback: Callback,
   data: any
) => void
Your race() should accept AsyncFunc array, and return a new function which triggers its own callback when any async function is done or an error occurs.

Suppose we have an 3 async functions

const async1 = (callback) => {
   setTimeout(() => callback(undefined, 1), 300)
}
const async2 = (callback) => {
    setTimeout(() => callback(undefined, 2), 100)
}
const async3 = (callback) => {
   setTimeout(() => callback(undefined, 3), 200)
}
Your race() should be able to accomplish this

const first = race(
  [
    async1,
    async2,
    async3
  ]
)
first((error, data) => {
   console.log(data) // 2, since 2 is the first to be given
}, 1)
When error occurs, only first error is passed down to the last. Later errors or data are ignored.
 */

function race(
    funcs: ((cb: (err: any, data?: any) => void, input: any) => void)[]
) {
    return function (callback: (err: any, data?: any) => void, input: any) {
        let finished = false;
        if (funcs.length === 0) {
            callback(undefined, undefined);
            return;
        }
        funcs.forEach((fn) => {
            fn((err, data) => {
                if (finished) return;
                finished = true;
                callback(err, err ? undefined : data);
            }, input);
        });
    };
}

/**
 * @param {AsyncFunc[]} funcs
 * @return {(callback: Callback) => void}
 */
function race1(funcs) {
    let finished = false;
    return function (callback) {
        const callbackWrapper = (...args) => {
            if (finished) return;
            callback(...args);
            finished = true;
        };
        for (const func of funcs) {
            func(callbackWrapper);
        }
    };
}
