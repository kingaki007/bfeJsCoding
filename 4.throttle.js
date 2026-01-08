/**
 * Throttling is a common technique used in Web apps, in most cases using lodash solution would be a good choice.

In case you forgot, throttle(func, delay) returns a throttled function, which invokes func at a max frequency no matter how throttled one is called.

Here is an example.

Before throttling we have following series of calls.

─ A ─ B ─ C ─ ─ D ─ ─ ─ ─ ─ ─ E ─ ─ F ─ G
After throttling at wait time of 3 dashes, it becomes like this.

─ A ─ ─ ─ C ─ ─ ─ D ─ ─ ─ ─ E ─ ─ ─ G 
A is triggered right way because not in waiting time. B is swallowed because B, C are in the cooling time from A, and C is called after B.

Could you implement your own version of basic throttle()?

notes

Please follow above spec, the behavior is not exactly the same as lodash.throttle().

Since window.setTimeout and window.clearTimeout are not accurate in browser environment, they are replaced with other implementation when judging your code. They still have the same interfaces, and internally keep track of the timing for testing purpose.

Some code like below is used to test your implementation.

let currentTime = 0
const run = (input) => {
  currentTime = 0
  const calls = []
  const func = (arg) => {
     calls.push(`${arg}@${currentTime}`)
  }
  const throttled = throttle(func, 3)
  input.forEach((call) => {
     const [arg, time] = call.split('@')
     setTimeout(() => throttled(arg), time)
  })
  return calls
}
expect(run(['A@0', 'B@2', 'C@3'])).toEqual(['A@0', 'C@3'])

https://lodash.com/docs/4.17.15#throttle

 */

/**
 * @param {(...args:any[]) => any} func
 * @param {number} wait
 * @returns {(...args:any[]) => any}
 */

// function throttle(fn, wait) {
//     let timer = null;
//     let stashedCall = [];

//     function timeup() {
//         timer = null;
//         if (stashedCall) {
//             fn.call(...stashedCall);
//             timer = setTimeout(timeup, wait);
//             stashedCall = null;
//         }
//     }

//     return function throttled(...args) {
//         if (timer === null) {
//             fn.call(this, args);
//             timer = setTimeout(timeup, wait);
//         } else {
//             stashedCall = [this, args];
//         }
//     };
// }

function throttle(fn, wait) {
    let timer = null;
    let stashedCall = [];

    function timeup() {
        timer = null;
        if (stashedCall) {
            fn.apply(...stashedCall);
            timer = setTimeout(timeup, wait);
            stashedCall = null;
        }
    }

    return function throttled(...args) {
        if (timer === null) {
            fn.apply(this, args);
            timer = setTimeout(timeup, wait);
        } else {
            stashedCall = [this, args];
        }
    };
}

let currentTime = 0;
const run = (input) => {
    currentTime = 0;
    const calls = [];
    const func = (arg) => {
        calls.push(`${arg}@${currentTime}`);
    };
    const throttled = throttle(func, 3);
    input.forEach((call) => {
        const [arg, time] = call.split("@");
        setTimeout(() => throttled(arg), time);
    });
    return calls;
};
console.log(run(["A@0", "B@2", "C@3"]));
