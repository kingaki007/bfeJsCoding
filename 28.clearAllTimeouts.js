/**
 * window.setTimeout() could be used to schedule some task in the future.

Could you implement clearAllTimeout() to clear all the timers ? This might be useful when we want to clear things up before page transition.

For example

setTimeout(func1, 10000)
setTimeout(func2, 10000)
setTimeout(func3, 10000)
// all 3 functions are scheduled 10 seconds later
clearAllTimeout()
// all scheduled tasks are cancelled.
note

You need to keep the interface of window.setTimeout and window.clearTimeout the same, but you could replace them with new logic
 */
const window = globalThis;
const func1 = () => console.log("one");
const func2 = () => console.log("two");
const func3 = () => console.log("three");

window.timerIds = new Set();

const { setTimeout: _setTimeout, clearTimeout: _clearTimeout } = window;

window.setTimeout = function (fn, delay, ...args) {
    let timer;

    timer = _setTimeout(() => {
        fn.apply(this, args);
        window.timerIds.delete(timer);
    }, delay);

    window.timerIds.add(timer);
    return timer;
};

window.clearTimeout = function (timer) {
    window.timerIds.delete(timer);
    _clearTimeout(timer);
};

function clearAllTimeout() {
    for (timer of window.timerIds) {
        clearTimeout(timer);
    }
}

// Solution 2:
/**
 * cancel all timer from window.setTimeout
 */
// since the timeout id is incremental,
// just get the largest one by making one
//  setTimeout call and down level to clear all.

// Note: bad time complexity
// function clearAllTimeout() {
//     // your code here
//     let id = setTimeout(null, 0);
//     while (id >= 0) {
//         window.clearTimeout(id);
//         id--;
//     }
// }

setTimeout(func1, 1000);
setTimeout(func2, 2000);
setTimeout(func3, 3000);
// all 3 functions are scheduled 10 seconds later
clearAllTimeout();
