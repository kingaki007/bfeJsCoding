/**
 * Implement a spyOn(object, methodName) function similar to jest.spyOn().
 *
 * Requirements:
 * 1. The original method should be called when the spied one is called.
 * 2. The spy should have a `calls` array, which holds all the arguments for each call.
 *
 * Example:
 * const obj = {
 *   data: 1,
 *   increment(num) {
 *     this.data += num;
 *   }
 * }
 * const spy = spyOn(obj, 'increment');
 * obj.increment(1);
 * console.log(obj.data); // 2
 * obj.increment(2);
 * console.log(obj.data); // 4
 * console.log(spy.calls); // [[1], [2]]
 */

function spyOn(object, methodName) {
    const original = object[methodName];
    const calls = [];
    object[methodName] = function (...args) {
        calls.push([...args]);
        return original.apply(this, args);
    };
    return { calls };
}

const obj = {
    data: 1,
    increment(num) {
        this.data += num;
    },
};
const spy = spyOn(obj, "increment");
obj.increment(1);
console.log(obj.data); // 2
obj.increment(2);
console.log(obj.data); // 4
console.log(spy.calls);

// function spyOn(object, methodName) {
//     const original = object[methodName];
//     const calls = [];
//     object[methodName] = function () {
//         calls.push(Array.from(arguments));
//         return original.apply(this, arguments);
//     };
//     return { calls };
// }
