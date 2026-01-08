/**
 * This is a variation of 37. implement Binary Search (unique).

Your are given a sorted ascending array of number, but might have duplicates, you are asked to return the first index of a target number.

If not found return -1.

note

Please don't use Array.prototype.indexOf(), it is not our goal.
 */

/**
 * @param {number[]} arr - ascending array with duplicates
 * @param {number} target
 * @return {number}
 */
function firstIndex(arr, target) {
    // your code here
    let s = 0,
        e = arr.length - 1;
    let ans = -1;
    while (s <= e) {
        let m = Math.floor((s + e) / 2);
        if (arr[m] === target) {
            let i = m;
            while (arr[i] === target) {
                i--;
            }
            return (ans = i + 1);
        } else if (arr[m] < target) {
            s = m + 1;
        } else {
            e = m - 1;
        }
    }
    return ans;
}
