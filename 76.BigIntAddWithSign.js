/**
 * This is a follow-up on 62. implement BigInt addition.

You are asked to implement a string addition function, with possible negative integers. Also, '+' plus sign should also be supported

add('-999999999999999999', '-1')
// '-1000000000000000000'
add('-999999999999999999', '+1')
// '-999999999999999998'
Don't use BigInt directly, it is not our goal here.
 */

/**
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
function add(num1, num2) {
    // Helper function to add two positive numbers
    function addPositive(a, b) {
        let carry = 0;
        let result = "";
        let i = a.length - 1;
        let j = b.length - 1;

        while (i >= 0 || j >= 0 || carry > 0) {
            const digit1 = i >= 0 ? parseInt(a[i]) : 0;
            const digit2 = j >= 0 ? parseInt(b[j]) : 0;
            const sum = digit1 + digit2 + carry;

            result = (sum % 10) + result;
            carry = Math.floor(sum / 10);

            i--;
            j--;
        }

        return result;
    }

    // Helper function to subtract two positive numbers
    // Assumes a >= b
    function subtractPositive(a, b) {
        let borrow = 0;
        let result = "";
        let i = a.length - 1;
        let j = b.length - 1;

        while (i >= 0) {
            const digit1 = parseInt(a[i]);
            const digit2 = j >= 0 ? parseInt(b[j]) : 0;
            let diff = digit1 - digit2 - borrow;

            if (diff < 0) {
                diff += 10;
                borrow = 1;
            } else {
                borrow = 0;
            }

            result = diff + result;
            i--;
            j--;
        }

        // Remove leading zeros
        return result.replace(/^0+/, "") || "0";
    }

    // Helper function to compare two positive number strings
    function comparePositive(a, b) {
        if (a.length !== b.length) return a.length - b.length;
        return a.localeCompare(b);
    }

    // Remove leading + and get sign
    let sign1 = num1[0] === "-" ? -1 : 1;
    let sign2 = num2[0] === "-" ? -1 : 1;

    // Remove signs from numbers
    let abs1 = num1.replace(/^[+-]/, "");
    let abs2 = num2.replace(/^[+-]/, "");

    // If signs are same, add absolute values and keep sign
    if (sign1 === sign2) {
        const result = addPositive(abs1, abs2);
        return (sign1 === -1 ? "-" : "") + result;
    }

    // If signs are different, subtract smaller from larger
    const comparison = comparePositive(abs1, abs2);
    if (comparison > 0) {
        // |abs1| > |abs2|
        const result = subtractPositive(abs1, abs2);
        return (sign1 === -1 ? "-" : "") + result;
    } else if (comparison < 0) {
        // |abs1| < |abs2|
        const result = subtractPositive(abs2, abs1);
        return (sign2 === -1 ? "-" : "") + result;
    } else {
        // Numbers are equal in magnitude but opposite signs
        return "0";
    }
}
