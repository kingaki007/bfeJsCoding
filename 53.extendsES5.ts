// Implementation of myExtends in ES5
// function myExtends(SuperType, SubType) {
//     function Inherited() {
//         SuperType.apply(this, arguments);
//         SubType.apply(this, arguments);
//     }
//     // Set up prototype chain: instance.__proto__ === SubType.prototype
//     Inherited.prototype = SubType.prototype;
//     // Set up prototype chain for SubType.prototype: SubType.prototype.__proto__ === SuperType.prototype
//     if (Object.setPrototypeOf) {
//         Object.setPrototypeOf(SubType.prototype, SuperType.prototype);
//     } else {
//         SubType.prototype.__proto__ = SuperType.prototype;
//     }
//     Inherited.prototype.constructor = Inherited;
//     // Set up static inheritance: ExtendedType.__proto__ === SuperType
//     if (Object.setPrototypeOf) {
//         Object.setPrototypeOf(Inherited, SuperType);
//     } else {
//         Inherited.__proto__ = SuperType;
//     }
//     // Copy static properties from SubType
//     for (var staticKey2 in SubType) {
//         if (SubType.hasOwnProperty(staticKey2)) {
//             Inherited[staticKey2] = SubType[staticKey2];
//         }
//     }
//     return Inherited;
// }
/**
 * Implement a myExtends() function in ES5 to mimic the behavior of extends.
 *
 * myExtends() takes a SubType and SuperType, and returns a new type.
 *
 * Example usage:
 *   const InheritedSubType = myExtends(SuperType, SubType)
 *   const instance = new InheritedSubType()
 *   // The above should work (almost) the same as:
 *   class SubType extends SuperType {}
 *   const instance = new SubType()
 *
 * Your code will be tested against the following SuperType and SubType:
 *
 * function SuperType(name) {
 *     this.name = name
 *     this.forSuper = [1, 2]
 *     this.from = 'super'
 * }
 * SuperType.prototype.superMethod = function() {}
 * SuperType.prototype.method = function() {}
 * SuperType.staticSuper = 'staticSuper'
 *
 * function SubType(name) {
 *     this.name = name
 *     this.forSub = [3, 4]
 *     this.from = 'sub'
 * }
 * SubType.prototype.subMethod = function() {}
 * SubType.prototype.method = function() {}
 * SubType.staticSub = 'staticSub'
 *
 * To solve this problem, you need to fully understand inheritance.
 */

// Example
function SuperType(name) {
    this.name = name;
    this.forSuper = [1, 2];
    this.from = "super";
}
SuperType.prototype.superMethod = function () {};
SuperType.prototype.method = function () {};
SuperType.staticSuper = "staticSuper";
function SubType(name) {
    this.name = name;
    this.forSub = [3, 4];
    this.from = "sub";
}
SubType.prototype.subMethod = function () {};
SubType.prototype.method = function () {};
SubType.staticSub = "staticSub";

// console.log(instance);

const myExtends = (SuperType, SubType) => {
    function ExtendType(...args) {
        /**
         * About this:
         * When call a function, there will be a this pointer in the function
         * If call with new, js will create a new object, and let 'this' point to that object
         * If call without new, this point to whoever called this function
         */
        // use SuperType and SubType constructor to init this.
        SuperType.call(this, ...args);
        SubType.call(this, ...args);
        // build the prototype chain connection, let current this's constructor's prototype point to SubType.prototype
        Object.setPrototypeOf(this, SubType.prototype);
        // this.__proto__ = SubType.prototype;
    }
    // link SubType's prototype chain to SuperType's prototype
    Object.setPrototypeOf(SubType.prototype, SuperType.prototype);
    // SubType.prototype.__proto__ = SuperType.prototype;
    // link ExtendType's prototype chain to SubType's prototype
    Object.setPrototypeOf(ExtendType.prototype, SubType.prototype);
    // ExtendType.prototype.__proto__ = SubType.prototype;
    // link ExtendType's prototype chain to SubType
    // In this case, when we trying to find the static function on ExtendType, we can also find SuperType
    Object.setPrototypeOf(ExtendType, SuperType);
    // ExtendType.__proto__ = SuperType
    return ExtendType;
};

const myExtendsShort = (SuperType, SubType) => {
    SubType.prototype = new SuperType();
    SubType.__proto__ = SuperType;
    return SubType;
};

const ExtendType = myExtends(SuperType, SubType);
const instance = new ExtendType("test");
console.log(instance);
