/**
 * One of the differences between null and undefined is how they are treated differently in JSON.stringify().
 *
 * JSON.stringify({a: null})      // '{"a":null}'
 * JSON.stringify({a: undefined}) // '{}'
 * JSON.stringify([null])         // '[null]'
 * JSON.stringify([undefined])    // '[null]'
 *
 * This difference might create troubles if there are missing alignments between client and server.
 * It might be helpful to enforce using only one of them.
 *
 * You are asked to implement undefinedToNull() to return a copy that has all undefined replaced with null.
 *
 * Examples:
 * undefinedToNull({a: undefined, b: 'BFE.dev'})
 * // {a: null, b: 'BFE.dev'}
 *
 * undefinedToNull({a: ['BFE.dev', undefined, 'bigfrontend.dev']})
 * // {a: ['BFE.dev', null, 'bigfrontend.dev']}
 */

/**
 * @param {any} arg
 * @returns {any}
 */
function undefinedToNull(obj) {
    if (Array.isArray(obj)) {
        return obj.map(undefinedToNull);
    }
    if (obj !== null && typeof obj === "object") {
        const result = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const value = obj[key];
                result[key] =
                    value === undefined ? null : undefinedToNull(value);
            }
        }
        return result;
    }
    return obj === undefined ? null : obj;
}

// Solution 2:
function undefinedToNull1(arg) {
    if (arg == null || arg == undefined) {
        return null;
    }
    if (typeof arg !== "object") {
        return arg;
    }
    if (Array.isArray(arg)) {
        return arg.map(undefinedToNull1);
    }

    return Object.keys(arg).reduce((result, key) => {
        result[key] = undefinedToNull1(arg[key]);
        return result;
    }, {});
}
