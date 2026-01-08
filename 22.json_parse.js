// TODO: try yourself
/**
 * 
 * This is a follow-up on 21. implement JSON.stringify().

Believe you are already familiar with JSON.parse(), could you implement your own version?

In case you are not sure about the spec, MDN here might help.

JSON.parse() support a second parameter reviver, you can ignore that.

note

Don't use JSON.parse() in your code here It doesn't help you practicing your skills.
 * 
 */

// solution 1:
/**
 * @param {string} str
 * @return {object | Array | string | number | boolean | null}
 */
function parse(str) {
    if (str === "") {
        throw Error();
    }
    if (str[0] === "'") {
        throw Error();
    }
    if (str === "null") {
        return null;
    }
    if (str === "{}") {
        return {};
    }
    if (str === "[]") {
        return [];
    }
    if (str === "true") {
        return true;
    }
    if (str === "false") {
        return false;
    }
    if (str[0] === '"') {
        return str.slice(1, -1);
    }
    if (+str === +str) {
        return Number(str);
    }
    if (str[0] === "{") {
        return str
            .slice(1, -1)
            .split(",")
            .reduce((acc, item) => {
                const index = item.indexOf(":");
                const key = item.slice(0, index);
                const value = item.slice(index + 1);
                acc[parse(key)] = parse(value);
                return acc;
            }, {});
    }
    if (str[0] === "[") {
        return str
            .slice(1, -1)
            .split(",")
            .map((value) => parse(value));
    }
}

// solution 2:
/**
 * @param {string} str
 * @return {object | Array | string | number | boolean | null}
 */
function parse1(str) {
    let result = new Function(`return ${str.replace(/\"/g, "'")}`)();
    if (str !== JSON.stringify(result)) {
        throw new Error("Nope");
    }
    return result;
}

// copilot solution
function myJSONParse(str) {
    let i = 0;

    function skipWhitespace() {
        while (/\s/.test(str[i])) i++;
    }

    function parseValue() {
        skipWhitespace();
        if (str[i] === '"') return parseString();
        if (str[i] === "{") return parseObject();
        if (str[i] === "[") return parseArray();
        if (str[i] === "t") return parseLiteral("true", true);
        if (str[i] === "f") return parseLiteral("false", false);
        if (str[i] === "n") return parseLiteral("null", null);
        return parseNumber();
    }

    function parseString() {
        let result = "";
        i++; // skip opening "
        while (i < str.length) {
            if (str[i] === '"') {
                i++;
                return result;
            }
            if (str[i] === "\\") {
                i++;
                const escapes = {
                    '"': '"',
                    "\\": "\\",
                    "/": "/",
                    b: "\b",
                    f: "\f",
                    n: "\n",
                    r: "\r",
                    t: "\t",
                };
                if (str[i] === "u") {
                    let hex = str.substr(i + 1, 4);
                    result += String.fromCharCode(parseInt(hex, 16));
                    i += 5;
                } else {
                    result += escapes[str[i]] || str[i];
                    i++;
                }
            } else {
                result += str[i++];
            }
        }
        throw new SyntaxError("Unexpected end of string");
    }

    function parseNumber() {
        let start = i;
        if (str[i] === "-") i++;
        while (/\d/.test(str[i])) i++;
        if (str[i] === ".") {
            i++;
            while (/\d/.test(str[i])) i++;
        }
        if (str[i] === "e" || str[i] === "E") {
            i++;
            if (str[i] === "+" || str[i] === "-") i++;
            while (/\d/.test(str[i])) i++;
        }
        let num = Number(str.slice(start, i));
        if (isNaN(num)) throw new SyntaxError("Invalid number");
        return num;
    }

    function parseLiteral(literal, value) {
        if (str.substr(i, literal.length) === literal) {
            i += literal.length;
            return value;
        }
        throw new SyntaxError("Unexpected token");
    }

    function parseArray() {
        let result = [];
        i++; // skip [
        skipWhitespace();
        if (str[i] === "]") {
            i++;
            return result;
        }
        while (i < str.length) {
            result.push(parseValue());
            skipWhitespace();
            if (str[i] === ",") {
                i++;
                skipWhitespace();
                // If the next character is ] after a comma, that's a trailing comma (invalid)
                if (str[i] === "]") {
                    throw new SyntaxError("Trailing comma in array");
                }
            } else if (str[i] === "]") {
                i++;
                return result;
            } else {
                throw new SyntaxError("Expected , or ]");
            }
        }
        throw new SyntaxError("Unexpected end of array");
    }

    function parseObject() {
        let result = {};
        i++; // skip {
        skipWhitespace();
        if (str[i] === "}") {
            i++;
            return result;
        }
        while (i < str.length) {
            skipWhitespace();
            if (str[i] !== '"') throw new SyntaxError("Expected property name");
            let key = parseString();
            skipWhitespace();
            if (str[i] !== ":") throw new SyntaxError("Expected :");
            i++;
            skipWhitespace();
            // Check for invalid/missing value after colon
            if (str[i] === "," || str[i] === "}") {
                throw new SyntaxError("Missing value in object");
            }
            let value = parseValue();
            result[key] = value;
            skipWhitespace();
            if (str[i] === ",") {
                i++;
                skipWhitespace();
                // Trailing comma check
                if (str[i] === "}") {
                    throw new SyntaxError("Trailing comma in object");
                }
            } else if (str[i] === "}") {
                i++;
                return result;
            } else {
                throw new SyntaxError("Expected , or }");
            }
        }
        throw new SyntaxError("Unexpected end of object");
    }

    const result = parseValue();
    skipWhitespace();
    if (i !== str.length) throw new SyntaxError("Unexpected token");
    return result;
}
