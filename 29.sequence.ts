/**
 * This problem is similar to 11. what is Composition? create a pipe().

You are asked to implement an async function helper, sequence() which chains up async functions, like what pipe() does.

All async functions have following interface

type Callback = (error: Error, data: any) => void
type AsyncFunc = (
   callback: Callback,
   data: any
) => void
Your sequence() should accept AsyncFunc array, and chain them up by passing new data to the next AsyncFunc through data in Callback.

Suppose we have an async func which just multiple a number by 2

const asyncTimes2 = (callback, num) => {
   setTimeout(() => callback(null, num * 2), 100)
}
Your sequence() should be able to accomplish this

const asyncTimes4 = sequence(
  [
    asyncTimes2,
    asyncTimes2
  ]
)
asyncTimes4((error, data) => {
   console.log(data) // 4
}, 1)
Once an error occurs, it should trigger the last callback without triggering the uncalled functions.

Follow up

Can you solve it with and without Promise?
 */

type Callback = (error: Error | null, data?: any) => void;
type AsyncFunc = (callback: Callback, data: any) => void;

// Without promise
function sequence(funcs: AsyncFunc[]) {
    return function finalCallback(cb: Callback, initialData: any) {
        let idx = 0;
        function next(err: Error | null, data: any) {
            if (err || idx === funcs.length) {
                cb(err, data);
                return;
            }
            const fn = funcs[idx++];
            fn(next, data);
        }
        next(null, initialData);
    };
}

// Solution 2: with promises
function sequence1(funcs) {
    const promiseFuncs = funcs.map(promisify);

    return function (callback, input) {
        // init promise
        let promise = Promise.resolve(input);

        // add all promiseFuncs to promise
        promiseFuncs.forEach((promiseFunc) => {
            promise = promise.then(promiseFunc);
        });

        // handle resolved or rejected promise
        promise
            .then((data) => {
                callback(undefined, data);
            })
            .catch(callback);
    };
}
function promisify(callback) {
    return function (input) {
        return new Promise((resolve, reject) => {
            callback((err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(data);
            }, input);
        });
    };
}

// Solution 3:
// function sequence2(funcs: AsyncFunc[]) {
//     // Promisify each async function
//     function promisify(fn: AsyncFunc) {
//         return (input: any) =>
//             new Promise<any>((resolve, reject) => {
//                 fn((err, data) => {
//                     if (err) reject(err);
//                     else resolve(data);
//                 }, input);
//             });
//     }

//     const promiseFuncs = funcs.map(promisify);

//     return function (callback: Callback, input: any) {
//         let promise = Promise.resolve(input);
//         for (const promiseFunc of promiseFuncs) {
//             promise = promise.then(promiseFunc);
//         }
//         promise
//             .then((data) => callback(null, data))
//             .catch((err) => callback(err));
//     };
// }

function sequenceP(funcs) {
    function promisify(fn) {
        return function (input) {
            return new Promise((resolve, reject) => {
                fn((err, data) => {
                    if (err) reject(err);
                    resolve(data);
                }, input);
            });
        };
    }
    const promiseFuncs = funcs.map(promisify);

    return function (cb, data) {
        let promise = Promise.resolve(data);
        for (let promiseFn of promiseFuncs) {
            promise = promise.then(promiseFn);
        }

        promise.then((data) => cb(null, data)).catch((err) => cb(err));
    };
}

// Example usage:
const asyncTimes2 = (callback: Callback, num: number) => {
    setTimeout(() => callback(null, num * 2), 100);
};

const asyncTimes4 = sequenceP([asyncTimes2, asyncTimes2]);
asyncTimes4((error, data) => {
    console.log(data); // 4
}, 1);
