/**
 * This problem is similar to 31. Implement async helper - race(), but with Promise.
 *
 * The Promise.race() method returns a promise that fulfills or rejects as soon as one of the
 * promises in an iterable fulfills or rejects, with the value or reason from that promise.
 * Source: MDN
 *
 * Can you create a race() which works the same as Promise.race()?
 */

/**
 * @param {Array<Promise>} promises
 * @return {Promise}
 */
function race(promises) {
    // your code here
    return new Promise((resolve, reject) => {
        if (!Array.isArray(promises)) {
            return reject(new TypeError("Argument must be an array"));
        }
        if (promises.length === 0) {
            resolve([]);
            return;
        }

        promises.forEach((p) => {
            Promise.resolve(p)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
        });
    });
}

export default function promiseRace(iterable) {
    return new Promise((resolve, reject) => {
        if (iterable.length === 0) {
            return;
        }

        iterable.forEach(async (item) => {
            try {
                const result = await item;
                resolve(result);
            } catch (err) {
                reject(err);
            }
        });
    });
}
