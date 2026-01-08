/**
 *
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
function subtract(num1, num2) {
    // Normalize inputs by removing leading zeros
    const a = (num1 || "0").replace(/^0+/, "") || "0";
    const b = (num2 || "0").replace(/^0+/, "") || "0";

    // Compare to determine sign and order
    const cmp = compareStringsAsInts(a, b);
    if (cmp === 0) return "0";

    const isNegative = cmp < 0;
    const larger = isNegative ? b : a;
    const smaller = isNegative ? a : b;

    const result = subtractAbs(larger, smaller); // larger >= smaller
    return isNegative ? "-" + result : result;

    function compareStringsAsInts(x, y) {
        if (x.length !== y.length) return x.length - y.length;
        if (x === y) return 0;
        return x < y ? -1 : 1; // lexicographic works for equal-length digit strings
    }

    function subtractAbs(x, y) {
        // x >= y, both are normalized non-negative integer strings
        let i = x.length - 1;
        let j = y.length - 1;
        let borrow = 0;
        const out = [];

        while (i >= 0 || j >= 0) {
            const da = i >= 0 ? x.charCodeAt(i) - 48 : 0;
            const db = j >= 0 ? y.charCodeAt(j) - 48 : 0;

            let diff = da - borrow - db;
            if (diff < 0) {
                diff += 10;
                borrow = 1;
            } else {
                borrow = 0;
            }

            out.push(String.fromCharCode(48 + diff));
            i--;
            j--;
        }

        // Remove leading zeros from the final result
        while (out.length > 1 && out[out.length - 1] === "0") {
            out.pop();
        }

        return out.reverse().join("");
    }
}

function subtract1(num1, num2) {
    let difference = "";
    let borrow = false;
    num2 = num2.padStart(num1.length, 0); // Make sure both numbers have same length
    for (let i = num1.length - 1; i >= 0; i--) {
        let digit1 = +num1[i];
        const digit2 = +num2[i];
        if (borrow) {
            digit1 -= 1;
            borrow = false;
        }

        if (digit1 < digit2) {
            borrow = true;
            digit1 += 10;
        }
        difference = `${digit1 - digit2}${difference}`;
    }
    return +difference + "";
}
