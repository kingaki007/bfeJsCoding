/**
 * Write your own all() function that works like Promise.all().
 *
 * Notes:
 * - Do not use Promise.all() directly.
 * - Reference: MDN documentation.
 */

/**
 * Write your own all() function that works like Promise.all().
 *
 * Notes:
 * - Do not use Promise.all() directly.
 * - Reference: MDN documentation.
 */

/**
 * @param {Array<Promise|any>} promises
 * @returns {Promise}
 */
function all(promises) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(promises)) {
            return reject(new TypeError("Argument must be an array"));
        }
        const results = [];
        let completed = 0;
        if (promises.length === 0) {
            resolve([]);
            return;
        }
        promises.forEach((p, i) => {
            Promise.resolve(p).then(
                (value) => {
                    results[i] = value;
                    completed++;
                    if (completed === promises.length) {
                        resolve(results);
                    }
                },
                (err) => reject(err)
            );
        });
    });
}

function all(promises) {
    // your code here

    return new Promise((resolve, reject) => {
        const q = [];
        if (!Array.isArray(promises)) {
            return reject(new TypeError("Argument must be an array"));
        }
        if (promises.length === 0) {
            resolve([]);
            return;
        }
        promises.forEach((promise, i) => {
            Promise.resolve(promise)
                .then((res) => {
                    q[i] = res;
                    if (q.length === promises.length) {
                        resolve(q);
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        });
    });
}

// function all(promises) {
//     return new Promise((resolve, reject) => {
//         const result = new Array(promises.length);
//         let countOfResolved = 0;
//         function resolveWhenReady() {
//             if (countOfResolved === promises.length) {
//                 resolve(result);
//             }
//         }
//         for (let i = 0; i < promises.length; i++) {
//             const item = promises[i];
//             if (typeof item === "object" && "then" in item) {
//                 item.then(
//                     (data) => {
//                         result[i] = data;
//                         countOfResolved += 1;
//                         resolveWhenReady();
//                     },
//                     (reason) => {
//                         reject(reason);
//                     }
//                 );
//             } else {
//                 result[i] = item;
//                 countOfResolved += 1;
//                 resolveWhenReady();
//             }
//         }
//         resolveWhenReady();
//     });
// }

all([Promise.resolve(1), 2, Promise.reject(3)])
    .then(console.log)
    .catch(console.log);
// Example usage:
// all([Promise.resolve(1), 2, Promise.resolve(3)]).then(console.log); // [1, 2, 3]
