/**
 * This is a follow-up on 75. implement BigInt subtraction.

You are asked to implement a string substraction function, with possible negative integers. Also, '+' plus sign should also be supported

substract('-999999999999999999', '-1')
// '-999999999999999998'
substract('-999999999999999999', '+1')
// '-1000000000000000000'
Don't use BigInt directly, it is not our goal here.
 */

/**
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
function subtract(num1, num2) {
    // Helper add for positive numbers
    function addPositive(a, b) {
        let carry = 0;
        let res = "";
        let i = a.length - 1;
        let j = b.length - 1;
        while (i >= 0 || j >= 0 || carry) {
            const d1 = i >= 0 ? +a[i] : 0;
            const d2 = j >= 0 ? +b[j] : 0;
            const sum = d1 + d2 + carry;
            res = (sum % 10) + res;
            carry = Math.floor(sum / 10);
            i--;
            j--;
        }
        return res.replace(/^0+/, "") || "0";
    }

    // subtract b from a, where a >= b (both positive strings)
    function subtractPositive(a, b) {
        let i = a.length - 1;
        let j = b.length - 1;
        let borrow = 0;
        let res = "";
        while (i >= 0) {
            const d1 = +a[i];
            const d2 = j >= 0 ? +b[j] : 0;
            let diff = d1 - d2 - borrow;
            if (diff < 0) {
                diff += 10;
                borrow = 1;
            } else {
                borrow = 0;
            }
            res = diff + res;
            i--;
            j--;
        }
        return res.replace(/^0+/, "") || "0";
    }

    function comparePositive(a, b) {
        if (a.length !== b.length) return a.length - b.length;
        return a === b ? 0 : a > b ? 1 : -1;
    }

    // normalize: remove leading +, capture signs
    const s1 = num1.trim();
    const s2 = num2.trim();
    const sign1 = s1[0] === "-" ? -1 : 1;
    const sign2 = s2[0] === "-" ? -1 : 1;
    const abs1 = s1.replace(/^[+-]/, "").replace(/^0+(?=\d)|^0+$/, "") || "0";
    const abs2 = s2.replace(/^[+-]/, "").replace(/^0+(?=\d)|^0+$/, "") || "0";

    // Compute num1 - num2
    // Cases:
    // (+a) - (+b) => compare magnitudes
    // (+a) - (-b) => +(a+b)
    // (-a) - (+b) => -(a+b)
    // (-a) - (-b) => (-a) - (-b) = b - a

    if (sign1 === 1 && sign2 === -1) {
        // a - (-b) => a + b
        return addPositive(abs1, abs2);
    }
    if (sign1 === -1 && sign2 === 1) {
        // -a - b => -(a + b)
        return "-" + addPositive(abs1, abs2);
    }
    // both same sign
    if (sign1 === 1 && sign2 === 1) {
        // a - b
        const cmp = comparePositive(abs1, abs2);
        if (cmp === 0) return "0";
        if (cmp > 0) {
            return subtractPositive(abs1, abs2);
        } else {
            return "-" + subtractPositive(abs2, abs1);
        }
    }
    // both negative: (-a) - (-b) = b - a
    const cmp = comparePositive(abs1, abs2);
    if (cmp === 0) return "0";
    if (cmp > 0) {
        // |a| > |b| -> - (since -a - -b = -(a-b)) actually check: -a - -b = -a + b = b - a -> if a>b then result negative
        return "-" + subtractPositive(abs1, abs2);
    } else {
        return subtractPositive(abs2, abs1);
    }
}
