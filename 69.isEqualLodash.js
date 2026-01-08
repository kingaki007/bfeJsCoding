/**
 * _.isEqual is useful when you want to compare complex data types by value not the reference.

Can you implement your own version of deep equal isEqual? The lodash version covers a lot of data types. In this problem, you are asked to support :

primitives
plain objects (object literals)
array
Objects are compared by their own, not inherited, enumerable properties

const a = {a: 'bfe'}
const b = {a: 'bfe'}
isEqual(a, b) // true
a === b // false
const c = [1, a, '4']
const d = [1, b, '4']
isEqual(c, d) // true
c === d // false
Lodash implementation has some strange behaviors. (github issue, like following code

const a = {}
a.self = a
const b = {self: a}
const c = {}
c.self = c
const d = {self: {self: a}}
const e = {self: {self: b}}
lodash.isEqual gives us following result. Notice there is a case that resulting in false.

// result from lodash implementation
_.isEqual(a, b) // true
_.isEqual(a, c) // true
_.isEqual(a, d) // true
_.isEqual(a, e) // true
_.isEqual(b, c) // true
_.isEqual(b, d) // true
_.isEqual(b, e) // false
_.isEqual(c, d) // true
_.isEqual(c, e) // true
_.isEqual(d, e) // true
Setting aside the performance concerns mentioned by lodash, your implement should not have above problem, which means above all returns true and call stack should not exceed the maximum.


 */

/**
 * Deep equality check similar to Lodash's isEqual
 * @param {any} a - First value to compare
 * @param {any} b - Second value to compare
 * @returns {boolean} - True if values are deeply equal
 */
function isEqual(a, b) {
    // Handle primitives and reference equality
    if (a === b) return true;

    // Handle null/undefined cases
    if (a == null || b == null) return a === b;

    // Handle different types
    if (typeof a !== typeof b) return false;

    // Handle NaN
    if (Number.isNaN(a) && Number.isNaN(b)) return true;

    // Handle objects and arrays
    if (typeof a === "object") {
        // Check if both are arrays or both are objects
        const aIsArray = Array.isArray(a);
        const bIsArray = Array.isArray(b);

        if (aIsArray !== bIsArray) return false;

        // Use WeakMap to track circular references
        const visited = new WeakMap();

        function deepEqual(obj1, obj2) {
            // Handle circular references
            if (visited.has(obj1) && visited.get(obj1) === obj2) return true;
            if (visited.has(obj2) && visited.get(obj2) === obj1) return true;

            visited.set(obj1, obj2);
            visited.set(obj2, obj1);

            // Get own enumerable keys
            const keys1 = Object.keys(obj1);
            const keys2 = Object.keys(obj2);

            // Check if they have the same number of keys
            if (keys1.length !== keys2.length) return false;

            // Check each key-value pair
            for (let key of keys1) {
                if (!keys2.includes(key)) return false;

                const val1 = obj1[key];
                const val2 = obj2[key];

                // Recursive comparison for nested objects/arrays
                if (
                    typeof val1 === "object" &&
                    val1 !== null &&
                    typeof val2 === "object" &&
                    val2 !== null
                ) {
                    if (!deepEqual(val1, val2)) return false;
                } else {
                    // Direct comparison for primitives
                    if (val1 !== val2) return false;
                }
            }

            return true;
        }

        return deepEqual(a, b);
    }

    // For other types (functions, symbols, etc.), use strict equality
    return a === b;
}

// Alternative implementation with better circular reference handling
function isEqualAlternative(a, b) {
    const visited = new WeakMap();

    function compare(val1, val2) {
        // Handle primitives and reference equality

        if (val1 === val2) return true;

        // Handle null/undefined
        if (val1 == null || val2 == null) return val1 === val2;

        // Handle different types
        if (typeof val1 !== typeof val2) return false;

        // Handle NaN
        if (Number.isNaN(val1) && Number.isNaN(val2)) return true;

        // Handle objects and arrays
        if (typeof val1 === "object") {
            // Check for circular references
            if (visited.has(val1) && visited.get(val1) === val2) return true;
            if (visited.has(val2) && visited.get(val2) === val1) return true;

            // Mark as visited
            visited.set(val1, val2);
            visited.set(val2, val1);

            // Check if both are arrays or both are objects
            const val1IsArray = Array.isArray(val1);
            const val2IsArray = Array.isArray(val2);

            if (val1IsArray !== val2IsArray) return false;

            // Get own enumerable keys
            const keys1 = Object.keys(val1);
            const keys2 = Object.keys(val2);

            if (keys1.length !== keys2.length) return false;

            // Compare each property
            for (let key of keys1) {
                if (!keys2.includes(key)) return false;
                if (!compare(val1[key], val2[key])) return false;
            }

            return true;
        }

        return val1 === val2;
    }

    return compare(a, b);
}
