/**
 * Do you know how instanceOf works ?

If so, please write you own myInstanceOf().

class A {}
class B extends A {}
const b = new B()
myInstanceOf(b, B) // true
myInstanceOf(b, A) // true
myInstanceOf(b, Object) // true
function C() {}
myInstanceOf(b, C) // false
C.prototype = B.prototype
myInstanceOf(b, C) // true
C.prototype = {}
myInstanceOf(b, C) // false
 */

/**
 * Custom implementation of instanceof operator
 * @param {any} obj - The object to check
 * @param {Function} constructor - The constructor function to check against
 * @returns {boolean} - True if obj is an instance of constructor
 */
function myInstanceOf(obj, constructor) {
    // Handle null/undefined cases
    if (obj == null) return false;

    // Handle primitives - they are not instances of any constructor
    if (typeof obj !== "object" && typeof obj !== "function") return false;

    if (!constructor.prototype) throw Error;

    // Get the prototype of the object
    let currentProto = Object.getPrototypeOf(obj);

    // Traverse up the prototype chain
    while (currentProto !== null) {
        // Check if current prototype matches the constructor's prototype
        if (currentProto === constructor.prototype) {
            return true;
        }

        // Move up the prototype chain
        currentProto = Object.getPrototypeOf(currentProto);
    }

    return false;
}

// Alternative implementation using __proto__ (less recommended but shows the concept)
function myInstanceOfAlternative(obj, constructor) {
    // Handle null/undefined cases
    if (obj == null) return false;

    // Handle primitives
    if (typeof obj !== "object" && typeof obj !== "function") return false;

    // If constructor is not callable (not a function), throw error
    if (!constructor.prototype) throw Error;

    // Traverse the prototype chain
    let proto = obj.__proto__;

    while (proto !== null) {
        if (proto === constructor.prototype) {
            return true;
        }
        proto = proto.__proto__;
    }

    return false;
}

// Another implementation using a more explicit approach
function myInstanceOfExplicit(obj, constructor) {
    // Basic validation
    if (obj == null || typeof constructor !== "function") return false;

    // Handle primitives
    if (typeof obj !== "object" && typeof obj !== "function") return false;

    // Get the constructor's prototype
    const constructorPrototype = constructor.prototype;

    // If constructor has no prototype, it's not a valid constructor for instanceof
    if (constructorPrototype == null) return false;
    if (!constructor.prototype) throw Error;

    // Traverse the prototype chain
    let current = obj;
    while (current !== null) {
        current = Object.getPrototypeOf(current);
        if (current === constructorPrototype) {
            return true;
        }
    }

    return false;
}

function myInstanceOf(obj, target) {
    if (!obj || typeof obj !== "object") return false;

    if (!target.prototype) throw Error;

    if (Object.getPrototypeOf(obj) === target.prototype) {
        return true;
    } else {
        return myInstanceOf(Object.getPrototypeOf(obj), target);
    }
}
