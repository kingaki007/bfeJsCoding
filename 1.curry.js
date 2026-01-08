/**
 * Currying is a useful technique used in JavaScript applications.

Please implement a curry() function, which accepts a function and return a curried one.

Here is an example

const join = (a, b, c) => {
   return `${a}_${b}_${c}`
}
const curriedJoin = curry(join)
curriedJoin(1, 2, 3) // '1_2_3'
curriedJoin(1)(2, 3) // '1_2_3'
curriedJoin(1, 2)(3) // '1_2_3'
more to read

https://javascript.info/currying-partials
https://en.wikipedia.org/wiki/Currying
https://lodash.com/docs/4.17.15#curry
 */

const join = (a, b, c) => {
    return `${a}_${b}_${c}`;
};

/**
 * @param { (...args: any[]) => any } fn
 * @returns { (...args: any[]) => any }
 */

// const curry = (fn) => {
//     return function (...args) {
//         if (args.length >= fn.length) {
//             return fn.apply(this, args);
//         } else {
//             return function (...args2) {
//                 return fn.apply(this, args.concat(args2));
//             };
//         }
//     };
// };

// const curriedJoin = curry(join);
// console.log(curriedJoin(1)(2)(3));
// console.log(curriedJoin(1, 2, 3)); // '1_2_3'
// console.log(curriedJoin(1)(2, 3)); // '1_2_3'
// console.log(curriedJoin(1, 2)(3)); // '1_2_3'

// Improved curry implementation that supports repeated partial application
// (e.g. curried(1)(2)(3)) and arbitrary grouping of arguments.
const curryImproved = (fn) => {
    const curried = function (...args) {
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        }
        return function (...more) {
            return curried.apply(this, args.concat(more));
        };
    };
    return curried;
};

const curriedJoinImproved = curryImproved(join);
console.log(curriedJoinImproved(1)(2)(3));
console.log(curriedJoinImproved(1, 2, 3)); // '1_2_3'
console.log(curriedJoinImproved(1)(2, 3)); // '1_2_3'
console.log(curriedJoinImproved(1, 2)(3)); // '1_2_3'
