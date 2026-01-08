/**
 * This is a follow-up on 1. implement curry()

    please implement curry() which also supports placeholder.

    Here is an example

    const  join = (a, b, c) => {
        return `${a}_${b}_${c}`
    }
    const curriedJoin = curry(join)
    const _ = curry.placeholder
    curriedJoin(1, 2, 3) // '1_2_3'
    curriedJoin(_, 2)(1, 3) // '1_2_3'
    curriedJoin(_, _, _)(1)(_, 3)(2) // '1_2_3'
    Read more:

    https://javascript.info/currying-partials
    https://lodash.com/docs/4.17.15#curry
    https://github.com/planttheidea/curriable
 
*/

// export const curry = (fn) => {
//     return function curried(...args) {
//         const complete =
//             args.length >= fn.length && !args.includes(curry.placeholder);
//         if (complete) return fn.apply(this, args);
//         return function (...args2) {
//             const res = args.map((arg) =>
//                 arg === curry.placeholder && args2.length ? args2.shift() : arg
//             );
//             return curried(...res, ...args2);
//         };
//     };
// };

// curry.placeholder = Symbol();

function curry(fn) {
    return function curried(...args) {
        // if number of arguments match
        if (
            args.length >= fn.length &&
            args.slice(0, fn.length).every((item) => item !== curry.placeholder)
        ) {
            return fn.call(this, ...args);
        }
        // otherwise return a function which merges the args
        return function (...nextArgs) {
            const mappedArgsTo = args.map((item) =>
                item === curry.placeholder && nextArgs.length
                    ? nextArgs.shift()
                    : item
            );
            return curried.call(this, ...mappedArgsTo, ...nextArgs);
        };
    };
}
curry.placeholder = Symbol();

const join = (a, b, c) => {
    return `${a}_${b}_${c}`;
};
const curriedJoin = curry(join);
const _ = curry.placeholder;
console.log(curriedJoin(1, 2, 3)); // '1_2_3'
console.log(curriedJoin(_, 2)(1, 3)); // '1_2_3'
console.log(curriedJoin(_, _, _)(1)(_, 3)(2)); // '1_2_3'

// (1)(2)(3)

// (1, 2)(3)

// (1, 2, 3, 4)

// (1,2)(3), (1,2)(4)

// (_,_,3,4)(1,_)(2,5)

console.log((_, _, _, _)(_, 2, _)(_, 3)(1));

// (1)(_,3)(2)
