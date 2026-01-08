/**
 * This is a variation of 37. implement Binary Search (unique).

Your are given a sorted ascending array of number, but might have duplicates, you are asked to return the element right before first appearance of a target number.

If not found return undefined.

note

Please don't use Array.prototype.indexOf(), it is not our goal.
 */

/**
 * @param {number[]} arr - ascending array with duplicates
 * @param {number} target
 * @return {number}
 */
function elementBefore(arr, target) {
    // your code here
    let start = 0,
        end = arr.length - 1;
    while (start <= end) {
        const mid = start + Math.floor((end - start) / 2);
        if (arr[mid] === target) {
            if (arr[mid - 1] !== target) return arr[mid - 1];
            end = mid - 1;
        } else if (arr[mid] < target) start = mid + 1;
        else end = mid - 1;
    }
}
