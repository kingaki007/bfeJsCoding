/**
 * Do you prefer snake_case or camelCase ?

Anyway, please create a function to convert snake_case to camcelCase.

snakeToCamel('snake_case') 
// 'snakeCase'
snakeToCamel('is_flag_on') 
// 'isFlagOn'
snakeToCamel('is_IOS_or_Android') 
// 'isIOSOrAndroid'
snakeToCamel('_first_underscore') 
// '_firstUnderscore'
snakeToCamel('last_underscore_') 
// 'lastUnderscore_'
snakeToCamel('_double__underscore_') 
// '_double__underscore_'
contiguous underscore __, leading underscore _a, and trailing underscors a_ should be kept untouched.
 */

function snakeToCamel(str) {
    if (typeof str !== "string") throw new TypeError("input must be a string");
    const n = str.length;
    let res = "";
    for (let i = 0; i < n; i++) {
        const ch = str[i];
        if (ch !== "_") {
            res += ch;
            continue;
        }

        const prev = i > 0 ? str[i - 1] : null;
        const next = i < n - 1 ? str[i + 1] : null;

        // Preserve underscore if it's leading, trailing, or contiguous with other underscores
        if (prev === "_" || next === "_" || i === 0 || i === n - 1) {
            res += "_";
            continue;
        }

        // Single underscore between characters: remove underscore and uppercase next char
        res += next.toUpperCase();
        i++; // skip next char
    }
    return res;
}

function snakeToCamel2(str) {
    return str.replace(
        /([^_])_([^_])/g,
        (_, before, after) => before + after.toUpperCase()
    );
}

function snakeToCamel1(str) {
    let result = str[0]; // in any case we want to keep first char as it is
    for (let i = 1; i < str.length; i++) {
        // begin from i=1 as we already have 0th index char
        /** main logic: Details explanation is coming soon.
    1. current char `i` must be '_'
    2. previous char must not be '_'
    3. next char must not be '_'
    4. current char must less than 2nd last of string
    **/
        if (
            str[i] == "_" &&
            str[i - 1] != "_" &&
            str[i + 1] != "_" &&
            i < str.length - 1
        ) {
            result += str[i + 1].toUpperCase();
            i++; // increment because we already consider i+1 in previous line.
        } else {
            result += str[i]; // else just add in the result string
        }
    }
    return result; // 🍻 return the camelCase because that's the way
}
