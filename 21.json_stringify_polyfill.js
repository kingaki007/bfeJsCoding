// TODO: try yourself
/**
 * I believe you've used JSON.stringify() before, do you know the details of how it handles arbitrary data?

Please have a guess on the details and then take a look at the explanation on MDN, it is actually pretty complex.

In this problem, you are asked to implement your own version of JSON.stringify().

In a real interview, you are not expected to cover all the cases, just decide the scope with interviewer. But for a goal of practicing, your code here will be tested against a lot of data types. Please try to cover as much as you can.

Attention to the circular reference.

note

JSON.stringify() support two more parameters which is not required here.

Don't use JSON.stringify() in your code here, it doesn't help you practicing coding skills.
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
 */

function jsonStringify(value) {
    const seen = new WeakSet();
    function _stringify(val) {
        // Handle primitives
        if (val === null) return "null";
        if (typeof val === "bigint")
            throw new TypeError("Do not know how to serialize a BigInt");
        if (typeof val === "number") {
            return isFinite(val) ? String(val) : "null";
        }
        if (typeof val === "boolean") return String(val);
        if (typeof val === "string")
            return (
                '"' +
                val
                    .replace(/\\/g, "\\\\")
                    .replace(/"/g, '\\"')
                    .replace(/\n/g, "\\n")
                    .replace(/\r/g, "\\r")
                    .replace(/\t/g, "\\t") +
                '"'
            );
        if (
            typeof val === "undefined" ||
            typeof val === "function" ||
            typeof val === "symbol"
        )
            return undefined;
        // Handle Date
        if (val instanceof Date) return '"' + val.toISOString() + '"';
        // Handle Array
        if (Array.isArray(val)) {
            if (seen.has(val))
                throw new TypeError("Converting circular structure to JSON");
            seen.add(val);
            const arr = val.map((item) => {
                const v = _stringify(item);
                return v === undefined ? "null" : v;
            });
            seen.delete(val);
            return "[" + arr.join(",") + "]";
        }
        // Handle Map (as object with own enumerable properties, not entries)
        if (val instanceof Map) {
            // Only serialize own enumerable properties (not entries)
            const props = [];
            for (let key in val) {
                if (Object.prototype.hasOwnProperty.call(val, key)) {
                    const v = _stringify(val[key]);
                    if (v !== undefined) {
                        props.push('"' + key + '":' + v);
                    }
                }
            }
            return "{" + props.join(",") + "}";
        }
        // Handle Set
        if (val instanceof Set) {
            return _stringify(Array.from(val));
        }
        // Handle Object
        if (typeof val === "object") {
            if (seen.has(val))
                throw new TypeError("Converting circular structure to JSON");
            seen.add(val);
            const props = [];
            for (let key in val) {
                if (Object.prototype.hasOwnProperty.call(val, key)) {
                    const v = _stringify(val[key]);
                    if (v !== undefined) {
                        props.push('"' + key + '":' + v);
                    }
                }
            }
            seen.delete(val);
            return "{" + props.join(",") + "}";
        }
        return undefined;
    }
    return _stringify(value);
}
// Example usage:
// jsonStringify({a:1, b:[2,3], c:null, d:undefined, e:()=>{}})

// Solution 2:
function stringify(data) {
    if (typeof data === "bigint") {
        throw new Error(
            "Do not know how to serialize a BigInt at JSON.stringify"
        );
    }
    if (typeof data === "string") {
        return `"${data}"`;
    }
    if (typeof data === "function") {
        return undefined;
    }
    if (data !== data) {
        return "null";
    }
    if (data === Infinity) {
        return "null";
    }
    if (data === -Infinity) {
        return "null";
    }
    if (typeof data === "number") {
        return `${data}`;
    }
    if (typeof data === "boolean") {
        return `${data}`;
    }
    if (data === null) {
        return "null";
    }
    if (data === undefined) {
        return "null";
    }
    if (typeof data === "symbol") {
        return "null";
    }
    if (data instanceof Date) {
        return `"${data.toISOString()}"`;
    }
    if (Array.isArray(data)) {
        const arr = data.map((el) => stringify(el));
        return `[${arr.join(",")}]`;
    }
    if (typeof data === "object") {
        const arr = Object.entries(data).reduce((acc, [key, value]) => {
            if (value === undefined) {
                return acc;
            }
            acc.push(`"${key}":${stringify(value)}`);
            return acc;
        }, []);
        return `{${arr.join(",")}}`;
    }
}
