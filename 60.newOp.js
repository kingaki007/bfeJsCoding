/**
 * new operator is used to create new instance objects.

    Do you know exactly what new does?

    You are asked to implement myNew(), which should return an object just as what new does but without using new.

    Pay attention to the return type of constructor.
 */

/**
 *
 * MDN Docs:
 *
 *
 * 1. Creates a blank, plain JavaScript object. For convenience, let's call it newInstance.
 *
 * 2. Points newInstance's [[Prototype]] to the constructor function's prototype property, if the prototype is an Object. Otherwise, newInstance stays as a plain object with Object.prototype as its [[Prototype]].
 *
 * 3. Executes the constructor function with the given arguments, binding newInstance as the this context (i.e., all references to this in the constructor function now refer to newInstance).
 *
 * If the constructor function returns a non-primitive, this return value becomes the result of the whole new expression. Otherwise, if the constructor function doesn't return anything or returns a primitive, newInstance is returned instead. (Normally constructors don't return a value, but they can choose to do so to override the normal object creation process.)
 *
 *
 * Note: Properties/objects added to the constructor function's prototype property are therefore accessible to all instances created from the constructor function.
 *
 */

function myNew(constructor, ...args) {
    // const newInstance = {};

    // newInstance.prototype = constructor.prototype;

    // const context = this;

    // let that = Object.create(constructor.prototype);
    // let obj = constructor.apply(that, args);

    // if (obj && typeof obj === "object") {
    //     return obj;
    // } else {
    //     return that;
    // }

    const obj = Object.create(
        typeof constructor.prototype === "object"
            ? constructor.prototype
            : Object.prototype
    );
    const instance = constructor.call(obj, ...args);
    if (instance === Object(instance)) {
        return instance;
    }
    return obj;
}

function myNew2(constructorFunc, ...args) {
    const obj = {};
    Object.setPrototypeOf(obj, constructorFunc.prototype);
    const returned = constructorFunc.call(obj, ...args);
    if (returned && typeof returned === "object") {
        return returned;
    }
    return obj;
}

function Person(name, age, sex) {
    this.name = name;
    this.age = age;
    this.sex = sex;
}

const randy = myNew2(Person, "Rand McNally", 33, "M");
const ken = myNew2(Person, "Ken Jones", 39, "M");

function Car(make, model, year, owner) {
    this.make = make;
    this.model = model;
    this.year = year;
    this.owner = owner;
}

const car1 = myNew2(Car, "Eagle", "Talon TSi", 1993, randy);
const car2 = myNew2(Car, "Nissan", "300ZX", 1992, ken);

console.log(car2.owner.name);
