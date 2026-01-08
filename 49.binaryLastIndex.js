/**
 * This is a variation of 37. implement Binary Search (unique).

Your are given a sorted ascending array of number, but might have duplicates, you are asked to return the last index of a target number.

If not found return -1.

note

Please don't use Array.prototype.lastIndexOf(), it is not our goal.
 */
/**
 * @param {number[]} arr - ascending array with duplicates
 * @param {number} target
 * @return {number}
 */
function lastIndex(arr, target) {
    let mid = Math.floor(arr.length / 2);
    if (target < arr[mid]) return lastIndex(arr.slice(0, mid), target);
    else if (target > arr[mid]) return lastIndex(arr.slice(mid), target);

    if (arr[mid] === target) {
        while (arr[mid + 1] === target) {
            mid++;
        }
        return mid;
    }
    return -1;
}
