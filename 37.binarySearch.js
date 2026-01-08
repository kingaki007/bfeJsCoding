/**
 * Even in Front-End review, basic algorithm technique like Binary Search are likely to be asked.

You are given an unique & ascending array of integers, please search for its index with Binary Search.

If not found, return -1

note

Please don't use Array.prototype.indexOf(), it is not our goal.
 */

/**
 * @param {number[]} arr - ascending unique array
 * @param {number} target
 * @return {number}
 */
function binarySearch(arr, target) {
    // your code here
    let ans = -1;

    let s = 0,
        e = arr.length - 1;

    while (s <= e) {
        let mid = Math.floor((s + e) / 2);

        if (arr[mid] === target) {
            ans = mid;
            return mid;
        } else if (arr[mid] > target) {
            e = mid - 1;
        } else {
            s = mid + 1;
        }
    }
    return ans;
}
