/**
 * Luckily we have BigInt in JavaScript so handle big numbers.

What if we need to do it by ourselves for older browsers?

You are asked to implement a string addition function, with all non-negative integers in string.

add('999999999999999999', '1')
// '1000000000000000000'
Don't use BigInt directly, it is not our goal here.
 */

function add(num1, num2) {
    let a = num1.split("").map(Number);
    let b = num2.split("").map(Number);
    let carry = 0;
    let result = [];
    while (a.length || b.length || carry) {
        const sum = (a.pop() ?? 0) + (b.pop() ?? 0) + carry;
        carry = sum < 10 ? 0 : 1;
        result.push(sum % 10);
    }
    return result.reverse().join("");
}

function add1(num1, num2) {
    const res = [];
    let i1 = num1.length - 1;
    let i2 = num2.length - 1;
    let carry = 0;
    while (i1 >= 0 || i2 >= 0 || carry) {
        const d1 = i1 >= 0 ? num1[i1--] - "0" : 0;
        const d2 = i2 >= 0 ? num2[i2--] - "0" : 0;
        const sum = d1 + d2 + carry;
        res.push(sum % 10);
        carry = Math.floor(sum / 10);
    }
    return res.reverse().join("");
}
