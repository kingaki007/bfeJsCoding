/**
 * 
 * This problem is related to 29. implement async helper - sequence().

You are asked to implement an async function helper, parallel() which works like Promise.all(). Different from sequence(), the async function doesn't wait for each other, rather they are all triggered together.

All async functions have following interface

type Callback = (error: Error, data: any) => void
type AsyncFunc = (
   callback: Callback,
   data: any
) => void
Your parallel() should accept AsyncFunc array, and return a new function which triggers its own callback when all async functions are done or an error occurs.

Suppose we have an 3 async functions

const async1 = (callback) => {
   callback(undefined, 1)
}
const async2 = (callback) => {
   callback(undefined, 2)
}
const async3 = (callback) => {
   callback(undefined, 3)
}
Your parallel() should be able to accomplish this

const all = parallel(
  [
    async1,
    async2,
    async3
  ]
)
all((error, data) => {
   console.log(data) // [1, 2, 3]
}, 1)
When error occurs, only first error is passed down to the last. Later errors or data are ignored.
 * 
 */

function parallel(funcs) {
    return function (callback, input) {
        let finished = false;
        let count = 0;
        const results = new Array(funcs.length);

        if (funcs.length === 0) {
            callback(undefined, []);
            return;
        }

        funcs.forEach((fn, idx) => {
            fn((err, data) => {
                if (finished) return;
                if (err) {
                    finished = true;
                    callback(err, undefined); // always pass undefined as second arg on error
                    return;
                }
                results[idx] = data;
                count++;
                if (count === funcs.length) {
                    finished = true;
                    callback(undefined, results);
                }
            }, input);
        });
    };
}

// Solution 2
const promisify = (fn) => (input) =>
    new Promise((res, rej) => {
        fn((err, output) => (err ? rej(err) : res(output)), input);
    });
function parallel(fns) {
    return (cb, input) => {
        Promise.all(fns.map((fn) => promisify(fn)(input)))
            .then((outputs) => cb(undefined, outputs))
            .catch((err) => cb(err, undefined));
    };
}

// Example usage:
const async1 = (cb) => cb(undefined, 1);
const async2 = (cb) => cb(undefined, 2);
const async3 = (cb) => cb(undefined, 3);

const all = parallel([async1, async2, async3]);
all((error, data) => {
    console.log(data); // [1, 2, 3]
}, 1);
