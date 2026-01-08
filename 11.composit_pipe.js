/**
 * what is Composition? It is actually not that difficult to understand, see @dan_abramov 's explanation.

https://whatthefuck.is/composition


Here you are asked to create a pipe() function, which chains multiple functions together to create a new function.

Suppose we have some simple functions like this

const times = (y) =>  (x) => x * y
const plus = (y) => (x) => x + y
const subtract = (y) =>  (x) => x - y
const divide = (y) => (x) => x / y
Your pipe() would be used to generate new functions

pipe([
  times(2),
  times(3)
])  
// x * 2 * 3
pipe([
  times(2),
  plus(3),
  times(4)
]) 
// (x * 2 + 3) * 4
pipe([
  times(2),
  subtract(3),
  divide(4)
]) 
// (x * 2 - 3) / 4
notes

to make things simple, functions passed to pipe() will all accept 1 argument    
 */

const times = (y) => (x) => x * y;
const plus = (y) => (x) => x + y;
const subtract = (y) => (x) => x - y;
const divide = (y) => (x) => x / y;

// function pipe1(fns) {
//     return function (x) {
//         return fns.reduce((acc, fn) => fn(acc), x);
//     };
// }

const pipe = (fns) => (x) => fns.reduce((acc, fn) => fn(acc), x);

console.log(pipe([times(2), times(3)])(5));
// x * 2 * 3
console.log(pipe([times(2), plus(3), times(4)])(5));
// (x * 2 + 3) * 4
console.log(pipe([times(2), subtract(3), divide(4)])(5));
// (x * 2 - 3) / 4
// (x * 2 - 3) / 4
