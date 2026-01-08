/**
 * _.once(func) is used to force a function to be called only once, later calls only returns the result of first call.

Can you implement your own once()?

function func(num) {
  return num
}
const onced = once(func)
onced(1) 
// 1, func called with 1
onced(2)
// 1, even 2 is passed, previous result is returned
 */

/**
 * @param {Function} func
 * @return {Function}
 */
function once(func) {
    // your code here
    let value = null;
    let count = 0;
    return function (...args) {
        if (count === 0) {
            value = func.call(this, ...args);
            count++;
        }

        return value;
    };
}
