// TODO: solve again
/**
 * Create a sum(), which makes following possible

const sum1 = sum(1)
sum1(2) == 3 // true
sum1(3) == 4 // true
sum(1)(2)(3) == 6 // true
sum(5)(-1)(2) == 6 // true
 */

// function sum(num) {
//     const func = (num1) => {
//         return num ? sum(num + num1) : num;
//     };

//     func.valueOf = () => num;

//     return func;
// }

/**
 * 
 * Solution explanation
 * 
 * Let's look at the code example line by line.

const sum1 = sum(1)
sum1(2) == 3 // true
sum1(3) == 4 // true
So first of all, sum() must return a function that accepts another number and then generates the sum. We can do something simple as below.

function sum(a) {
  return (b) => a + b
}
But this doesn't work for following line.

sum(1)(2)(3) == 6 // true
Here sum(1)(2) should return another function and so does the returned function. But how can we return a function which is also number at the same ?

Well notice that it is == here, not ===. According to ECMA spec, when one of the operands is an object(function is also object) and the other is number, the object is coerced to primitives.

Try out this quiz list about implicit coersion to know more

Based on ECMA spec of ToPrimitive, we have 3 ways to alter the coercion.

1. use well-known Symbols - recommended
const obj = {
  [Symbol.toPrimitive]() {
    return 100
  }
}
obj == 100 // true
2. use valueOf()
const obj = {
  valueOf() {
    return 100
  }
}
obj == 100 // true
3. use toString()
const obj = {
  toString() {
    return '100' // 100 also works
  }
}
obj == 100 // true
So we can satisfy the loose equal by setting the proper primitive value. Also notice that the returned function should return a function that behaves exactly the same, so we can leverage recursion to make things simple.

function sum(a) {
  const func = (b) => sum(a + b)
  func[Symbol.toPrimitive] = () => a
  return func
}
Of course following snippets also work.

function sum(a) {
  const func = (b) => sum(a + b)
  func.valueOf = () => a
  return func
}
function sum(a) {
  const func = (b) => sum(a + b)
  func.toString = () => a
  return func
}
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol#well-known_symbols
 * https://tc39.es/ecma262/#sec-toprimitive
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */

// function sum(num) {
//     const fn = (a) => (a ? sum(a + num) : num);
//     fn.valueOf = () => num;
//     fn.toString = () => num;
//     fn[Symbol.toPrimitive] = () => num;
//     return fn;
// }

function sum(num) {
    const fn = (a) => (a ? sum(num + a) : num);
    fn.valueOf = () => num;
    fn.toString = () => num;
    fn[Symbol.toPrimitive] = () => num;
    return fn;
}

const sum1 = sum(1);
console.log(sum1(2) == 3); // true
console.log(sum1(3) == 4); // true
console.log(sum(1)(2)(3) == 6); // true
console.log(sum(5)(-1)(2) == 6); // true

// solution 2
// function sum2(a) {
//     let total = a;
//     function inner(b) {
//         total += b;
//         return inner;
//     }
//     inner.valueOf = function () {
//         return total;
//     };
//     inner.toString = function () {
//         return String(total);
//     };
//     return inner;
// }
// console.log("===================");
// const sum3 = sum2(1);
// console.log(sum3(2) == 3); // true
// console.log(sum3(3).valueOf()); // true
// console.log(sum2(1)(2)(3) == 6); // true
// console.log(sum2(5)(-1)(2) == 6); // true
