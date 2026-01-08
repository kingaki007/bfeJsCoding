/**
 * There is already Array.prototype.flat() in JavaScript (ES2019), which reduces the nesting of Array. Please implement your own.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat

const arr = [1, [2], [3, [4]]];
flat(arr)
// [1, 2, 3, [4]]
flat(arr, 1)
// [1, 2, 3, [4]]
flat(arr, 2)
// [1, 2, 3, 4]
follow up

Are you able to solve it both recursively and iteratively? How do you handle sparse array?
 */

// function flatReduceRec(arr, depth = 1) {
//     return depth
//         ? arr.reduce((acc, curr) => {
//               return [
//                   ...acc,
//                   ...(Array.isArray(curr) ? flat(curr, depth - 1) : [curr]),
//               ];
//           }, [])
//         : arr;
// }

// const flatReduceConcat = (arr, depth = 1) => {
//     return depth
//         ? arr.reduce(
//               (acc, val) =>
//                   acc.concat(
//                       Array.isArray(val) ? flatReduceConcat(val, depth--) : val
//                   ),
//               []
//           )
//         : arr;
// };

// export const flatIterative = (arr, depth = 1) => {
//     const newArr = [];
//     for (const item of arr) {
//         if (Array.isArray(item) && depth > 0) {
//             newArr.push(...flat(item, depth - 1));
//         } else {
//             newArr.push(item);
//         }
//     }
//     return newArr;
// };

// export const flatReduce = (arr, depth = 1) => {
//     return arr.reduce((res, item) => {
//         if (Array.isArray(item) && depth > 0) {
//             res.push(...flat(item, depth - 1));
//         } else {
//             res.push(item);
//         }
//         return res;
//     }, []);
// };

// // this below one would be n**2 operation due to shift and unshift
// const flatIterative = function (arr, depth = 1) {
//     const result = [];
//     const tasks = arr.map((item) => [item, depth]);
//     while (tasks.length > 0) {
//         const [target, depth] = tasks.shift();
//         if (Array.isArray(target) && depth > 0) {
//             tasks.unshift(...target.map((item) => [item, depth - 1]));
//         } else {
//             result.push(target);
//         }
//     }
//     return result;
// };

// const flatIterativePushPop = function (arr, depth = 1) {
//     const result = [];
//     const tasks = arr.map((item) => [item, depth]);
//     while (tasks.length > 0) {
//         const [target, depth] = tasks.pop();
//         if (Array.isArray(target) && depth > 0) {
//             tasks.push(...target.map((item) => [item, depth - 1]));
//         } else {
//             result.push(target);
//         }
//     }
//     return result.reverse();
// };

// /** Below handles sparse arrays(empty slots) */
// function mapWithoutEmptySlots(arr, callback) {
//     const result = [];
//     arr.forEach((item) => {
//         result.push(callback(item));
//     });
//     return result;
// }

// const flatSparseArr = function (arr, depth = 1) {
//     const result = [];
//     const tasks = mapWithoutEmptySlots(arr, (item) => [item, depth]);
//     while (tasks.length > 0) {
//         const [target, depth] = tasks.pop();
//         if (Array.isArray(target) && depth > 0) {
//             tasks.push(
//                 ...mapWithoutEmptySlots(target, (item) => [item, depth - 1])
//             );
//         } else {
//             result.push(target);
//         }
//     }
//     return result.reverse();
// };

// self trials

// const flat_rec_concat = (arr, depth = 1) => {
//     return depth > 0
//         ? arr.reduce(
//               (acc, curr) =>
//                   acc.concat(
//                       Array.isArray(curr)
//                           ? flat_rec_concat(curr, --depth)
//                           : curr
//                   ),
//               []
//           )
//         : arr;
// };

// function arrWOEmptySlots(arr, depth) {
//     const res = [];
//     arr.forEach((a) => res.push([a, depth]));
//     return res;
// }

// const flat_iter = (arr, depth = 1) => {
//     const res = [];
//     const tasks = arrWOEmptySlots(arr, depth);
//     while (tasks.length > 0) {
//         const [t, d] = tasks.pop();
//         if (Array.isArray(t) && d > 0) {
//             tasks.push(...t.map((task) => [task, d - 1]));
//         } else {
//             res.push(t);
//         }
//     }
//     return res.reverse();
// };

const flat_rec = (arr, depth = Infinity) => {
    const res = [];
    for (let a of arr) {
        if (Array.isArray(a) && depth > 0) {
            res.push(...flat_rec(a, depth - 1));
        } else {
            res.push(a);
        }
    }
    return res;
};

const flat_concat_rec = (arr, depth) => {
    return depth > 0
        ? arr.reduce(
              (acc, curr) =>
                  acc.concat(
                      Array.isArray(curr)
                          ? flat_concat_rec(curr, depth - 1)
                          : curr
                  ),
              []
          )
        : arr;
};

function arrWoEmptySlots(arr, d) {
    const res = [];
    arr.forEach((a) => res.push([a, d]));
    return res;
}

const flat_iter_map = (arr, depth) => {
    const res = [];
    const tasks = arrWoEmptySlots(arr, depth);
    while (tasks.length > 0) {
        const [t, d] = tasks.pop();
        if (Array.isArray(t) && d > 0) {
            tasks.push(...t.map((item) => [item, d - 1]));
        } else {
            res.push(t);
        }
    }

    return res.reverse();
};

// const arr = new Array(5);
// arr[0] = 1;
// arr[2] = [1, 2];
// arr[3] = 4;
// // arr[4] = undefined;
// arr[5] = [5, [6, [7, 8]]];

const arr = [1, [2], , , [3, [4]]];
console.log(flat_rec(arr, 1));
console.log(flat_concat_rec(arr, 1));
console.log(flat_concat_rec(arr, 1));
