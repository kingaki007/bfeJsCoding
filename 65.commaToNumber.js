/**
 * Given a number, please create a function to add commas as thousand separators.

addComma(1) // '1'
addComma(1000) // '1,000'
addComma(-12345678) // '-12,345,678'
addComma(12345678.12345) // '12,345,678.12345'
 */

/**
 * @param {number} num
 * @return {string}
 */
function addComma(num) {
    // Convert number to string and handle sign
    let str = Math.abs(num).toString();

    // Split into integer and decimal parts
    const [intPart, decPart] = str.split(".");

    // Add commas to integer part
    const withCommas = intPart
        .split("")
        .reverse()
        .reduce((acc, digit, i) => {
            if (i > 0 && i % 3 === 0) {
                return digit + "," + acc;
            }
            return digit + acc;
        }, "");

    // Combine everything back together
    const result =
        (num < 0 ? "-" : "") + withCommas + (decPart ? "." + decPart : "");

    return result;
}

/**
 * @param {number} num
 * @return {string}
 */
function addComma(num) {
    const str = String(num);
    const numList = str.split(".");
    const numF = numList.length > 1 ? "." + numList[1] : "";

    return Number(numList[0]).toLocaleString() + numF;
}
