/**
 * 
 * Suppose you write some CSS code, you need to set colors. You can choose hexadecimal notation #fff or Functional notation rgba(255,255,255,1).

Can you write a function to convert hexadecimal notation to functional notation?

hexToRgb('#fff')
// 'rgba(255,255,255,1)'
Alpha channel should have maximum 2 digits after decimal point, round up if needed.
Don't forget to do input validation

https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
 * 
 */

/**
 * @param {string} hex
 * @return {string}
 */
function hexToRgba(hex) {
    if (typeof hex !== "string") throw new TypeError("hex must be a string");
    const input = hex.trim();
    const m = input.match(
        /^#?([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/
    );
    if (!m) throw new Error("Invalid hex color");

    let str = m[1];
    if (str.length === 3 || str.length === 4) {
        // expand shorthand: rgb -> rrggbb, rgba -> rrggbbaa
        str = str
            .split("")
            .map((ch) => ch + ch)
            .join("");
    }
    // now str is 6 or 8 chars
    const hasAlpha = str.length === 8;
    const r = parseInt(str.slice(0, 2), 16);
    const g = parseInt(str.slice(2, 4), 16);
    const b = parseInt(str.slice(4, 6), 16);
    let a = 1;
    if (hasAlpha) {
        const alphaHex = str.slice(6, 8);
        const alphaInt = parseInt(alphaHex, 16);
        a = +(alphaInt / 255).toFixed(4); // keep extra precision before rounding to 2
        // Round to max 2 decimal places, round up if needed
        a = Math.round(a * 100) / 100;
    }
    // ensure alpha formatted with up to 2 decimal digits (no trailing zeros unless needed)
    let aStr = a === 1 ? "1" : a.toFixed(2).replace(/\.?(0+)$/, "");

    return `rgba(${r},${g},${b},${aStr})`;
}

module.exports = hexToRgba;

const hexToRgba1 = (hex) => {
    const validChars = /^#[a-fA-F\d]+$/.test(hex);
    const validLength = [4, 5, 7, 9].includes(hex.length);
    if (!validLength || !validChars) {
        throw new Error("Invalid HEX");
    }
    const [r, g, b, a = 255] = hex
        .toLowerCase()
        .split("")
        .slice(1)
        .reduce((a, c) => `${a}${hex.length < 7 ? c.repeat(2) : c}`, "")
        .match(/(..)/g)
        .map((hex) => parseInt(hex, 16));
    return `rgba(${r},${g},${b},${Math.round((a / 255) * 100) / 100})`;
};

function hexToRgbaNoRegex(hex) {
    if (hex.indexOf("#") !== 0 || ![4, 5, 7, 9].includes(hex.length))
        throw "Invalid Input";
    hex = hex.slice(1);
    let r, g, b, a;
    if (hex.length <= 4) {
        [r, g, b] = [hex[0] + hex[0], hex[1] + hex[1], hex[2] + hex[2]];
        a = hex[3] ? hex[3] + hex[3] : "ff";
    } else if (hex.length === 6) {
        [r, g, b, a = "ff"] = [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4)];
    } else {
        [r, g, b, a] = [
            hex.slice(0, 2),
            hex.slice(2, 4),
            hex.slice(4, 6),
            hex.slice(6),
        ];
    }
    r = parseInt(`${r}`, 16);
    g = parseInt(`${g}`, 16);
    b = parseInt(`${b}`, 16);
    a = parseFloat((parseInt(`${a}`, 16) / 255).toFixed(2));
    return `rgba(${r},${g},${b},${a})`;
}

console.log(hexToRgba1("#eddaff"));
