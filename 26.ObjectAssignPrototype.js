/**
 * 
 * The Object.assign() method copies all enumerable own properties from one or more source 
 * objects to a target object. It returns the target object. (source: MDN)
It is widely used, Object Spread operator actually is internally
 the same as Object.assign() (source). Following 2 lines of code are totally the same.

let aClone = { ...a };
let aClone = Object.assign({}, a);
This is an easy one, could you implement Object.assign() with your own implementation ?

note

Don't use Object.assign() in your code It doesn't help improve your skills
 * 
 */

/**
 * @param {any} target
 * @param {any[]} sources
 * @return {object}
 */
function objectAssign(target, ...sources) {
    if (target === null || target === undefined)
        throw new Error("invalid target");
    let result = target;
    if (["number", "string", "boolean"].includes(typeof target)) {
        result = Object(target);
    }
    for (const source of sources) {
        if (source === null || source === undefined) continue;
        const keys = [
            ...Object.keys(source),
            ...Object.getOwnPropertySymbols(source).filter(
                (item) =>
                    Object.getOwnPropertyDescriptor(source, item).enumerable
            ),
        ];
        for (const key of keys) {
            if (!Reflect.set(result, key, source[key])) {
                throw new Error("cannot assign to read-only properties");
            }
        }
    }
    return result;
}

// Solution 2:
/**
 * @param {any} target
 * @param {any[]} sources
 * @return {object}
 */
function objectAssign(target, ...sources) {
    if (target === undefined || target === null) {
        throw "err";
    }
    target = Object(target);

    sources.forEach((source) => {
        if (source === undefined || source === null) {
            return;
        }
        Object.defineProperties(
            target,
            Object.getOwnPropertyDescriptors(source)
        );
    });

    return target;
}

// Solution 3:
function objectAssign(target, ...sources) {
    if (target == null) {
        throw Error();
    }

    target = Object(target);
    for (let source of sources) {
        if (source == null) continue;
        merge(Object.keys(source), source);
        merge(Object.getOwnPropertySymbols(source), source);
    }
    function merge(keys = [], currSource) {
        for (let key of keys) {
            target[key] = currSource[key];
            if (target[key] !== currSource[key]) {
                throw Error();
            }
        }
    }
    return target;
}

// Solution 4:
function objectAssign(target, ...sources) {
    // your code here
    if (target === null || target === undefined)
        throw new Error("invalid target");
    let result = Object(target);

    for (const source of sources) {
        if (source === null || source === undefined) continue;
        // Get string and symbol keys
        const keys = [
            ...Object.keys(source),
            ...Object.getOwnPropertySymbols(source).filter(
                (item) =>
                    Object.getOwnPropertyDescriptor(source, item).enumerable
            ),
        ];
        for (const key of keys) {
            // Check if property exists on target and is not writable
            const desc = Object.getOwnPropertyDescriptor(result, key);
            if (desc && !desc.writable) {
                throw new TypeError("Cannot assign to read-only property");
            }
            result[key] = source[key];
        }
    }
    return result;
}

const target = Object.defineProperty({}, "foo", {
    value: 1,
    writable: false,
});
