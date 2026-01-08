/**
 * Say you have multiple versions of a program, write a program that will find and return the first bad revision given a isBad(version) function.

Versions after first bad version are supposed to be all bad versions.

notes

Inputs are all non-negative integers
if none found, return -1
 */
// function firstBadVersion(isBad) {
//     return (version) => {
//         let s = 0,
//             e = version;
//         let ans = -1;

//         while (s <= e) {
//             let m = Math.floor((s + e) / 2);
//             if (isBad(m)) {
//                 ans = m;
//                 e = m - 1;
//             } else {
//                 s = m + 1;
//             }
//         }
//         return ans;
//     };
// }
function firstBadVersion(isBad) {
    return (version) => {
        let s = 0,
            e = version;
        let ans = -1;

        while (s <= e) {
            let m = Math.floor((s + e) / 2);
            if (isBad(m)) {
                ans = m;
                e = e - 1;
            } else {
                s = m + 1;
            }
        }
        return ans;
    };
}

function isBad(version) {
    return version >= 4;
}
const findFirstBad = firstBadVersion(isBad);

console.log(findFirstBad(7)); // Output: 4
console.log(findFirstBad(3)); // Output: -1 (no bad version in 0..3)
console.log(findFirstBad(4)); // Output: 4
