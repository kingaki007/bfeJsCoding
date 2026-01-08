/**
 * This is a variation of 37. implement Binary Search (unique).

Your are given a sorted ascending array of number, but might have duplicates, you are asked to return the element right after last appearance of a target number.

If not found return undefined.

note

Please don't use Array.prototype.lastIndexOf(), it is not our goal.
 */

/**
 * @param {number[]} arr - ascending array with duplicates
 * @param {number} target
 * @return {number}
 */
function elementAfter(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    while (left <= right) {
        // left + (right-left) / 2 helps to avoid overflow and ^ 0 drops decimal part.
        let middle = (left + (right - left) / 2) ^ 0;
        if (arr[middle] <= target) {
            left = middle + 1;
        } else {
            right = middle - 1;
        }
    }
    // If target was in the list then return the next number after it otherwise - undefined.
    return arr[left - 1] == target ? arr[left] : undefined;
}
