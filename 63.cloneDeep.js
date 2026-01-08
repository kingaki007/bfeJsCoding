/**
 * Object.assign() could be used to do shallow copy, while for recursive deep copy, _.cloneDeep could be very useful.

Can you create your own _.cloneDeep()?

The lodash implementation actually covers a lot of data types, for simplicity, your code just need to cover

primitive types and their wrapper Object
Plain Objects (Object literal) with all enumerable properties
Array
There is built-in structuredClone() now, but don't use this to practice
 */

function cloneDeep(obj, map = new Map()) {
    if (typeof obj !== "object" || obj === null) {
        return obj;
    }
    if (map.has(obj)) {
        return map.get(obj);
    }
    const keys = Reflect.ownKeys(obj);
    const result = Array.isArray(obj) ? [] : {};
    map.set(obj, result);
    keys.forEach((key) => {
        result[key] = cloneDeep(obj[key], map);
    });
    return result;
}

function cloneDeepOne(data, seenMap = new Map()) {
    if (data === null || typeof data !== "object") return data;
    if (seenMap.has(data)) return seenMap.get(data);
    const result = Array.isArray(data) ? [] : {};
    seenMap.set(data, result);
    const keys = [...Object.getOwnPropertySymbols(data), ...Object.keys(data)];

    for (const key of keys) {
        result[key] = cloneDeepOne(data[key], seenMap);
    }

    return result;
}

const arr = [1, 2];
arr[2] = { a: arr };
const clone = cloneDeep(arr);
// expect(clone).not.toBe(arr);
// expect(clone).toEqual(arr);
// expect(clone[2].a).toBe(clone);
