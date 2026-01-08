/**
 * The Promise.allSettled() method returns a promise that resolves after all of the given promises
 * have either fulfilled or rejected, with an array of objects that each describes the outcome of each promise.
 *
 * From MDN:
 * Different from Promise.all() which rejects right away once an error occurs,
 * Promise.allSettled() waits for all promises to settle.
 *
 * Now can you implement your own allSettled()?
 *
 * Note:
 * Do not use Promise.allSettled() directly, it helps nothing.
 */

/**
 * @param {Array<any>} promises - notice that input might contains non-promises
 * @return {Promise<Array<{status: 'fulfilled', value: any} | {status: 'rejected', reason: any}>>}
 */
function allSettled(promises) {
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

        promises.forEach((p, i) => {
            Promise.resolve(p)
                .then((res) => {
                    q[i] = { status: "fulfilled", value: res };
                    if (q.length === promises.length) {
                        resolve(q);
                    }
                })
                .catch((err) => {
                    q[i] = q[i] = { status: "rejected", reason: err };
                    if (q.length === promises.length) {
                        resolve(q);
                    }
                });
        });
    });
}
