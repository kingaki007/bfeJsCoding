/**
 * Function.prototype.call is very useful when we want to alter the `this` of a function.
 *
 * Can you implement your own `myCall`, which returns the same result as Function.prototype.call?
 *
 * For the newest ECMAScript spec, `thisArg` is not transformed and not replaced with `window` in Strict Mode.
 *
 * Your implementation should follow the above spec and do what non-Strict Mode does.
 *
 * Function.prototype.call/apply/bind and Reflect.apply should not be used.
 */

Function.prototype.myCall = function (thisArg, ...args) {
    thisArg = thisArg || global; // global should be window in browser
    thisArg = Object(thisArg);

    const sym = Symbol();

    thisArg[sym] = this;

    res = thisArg[sym](...args);

    delete thisArg[sym];

    return res;
};

// Testing
let obj = {
    a: 10,
    b: 20,
};
function tester(a, b) {
    return `a: ${this.a} and b: ${this.b} | curr args a: ${a} and b: ${b}`;
}
console.log(tester.myCall(obj, 30, 40));

const person = {
    name: "John",
};

function getName(obj) {
    return this.name + obj;
}

function sum(...args) {
    return args.reduce((acc, num) => acc + num, 0);
}

console.log(getName.myCall(person, "Akshay"));
console.log(sum.myCall(null, 1, 2, 3));
