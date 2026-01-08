/**
 * Say you need to fetch some data through 100 APIs, and as soon as possible.

If you use Promise.all(), 100 requests go to your server at the same time, which is a burden to low spec servers.

Can you throttle your API calls so that always maximum 5 API calls at the same time?

You are asked to create a general throttlePromises() which takes an array of functions returning promises, and a number indicating the maximum concurrent pending promises.

throttleAsync(callApis, 5).then((data) => {
  // the data is the same as `Promise.all` 
}).catch((err) => {
  // any error occurs in the callApis would be relayed here
})
By running above code, at any time, no more than 5 APIs are requested, so low spec servers are saved.
 */

/**
 * @param {() => Promise<any>} func
 * @param {number} max
 * @return {Promise}
 */
function throttlePromisesNew(funcs, max) {
    const results = [];
    async function doWork(iterator) {
        for (let [index, item] of iterator) {
            const result = await item();
            results[index] = result;
        }
    }
    const iterator = Array.from(funcs).entries();
    const workers = Array(max).fill(iterator).map(doWork); // maps over asynchronous fn doWork, which returns array of results for each promise
    return Promise.all(workers).then(() => results);
}

function throttlePromisesNew1(funcs, max) {
    let results = [];
    return new Promise((resolve, reject) => {
        let runningCount = 0;
        let queue = [...funcs];
        function run() {
            while (runningCount < max && queue.length > 0) {
                const fn = queue.shift();
                runningCount++;
                fn()
                    .then((data) => {
                        runningCount--;
                        results.push(data);
                        run();
                    })
                    .catch((err) => reject(err));
            }
            if (results.length === funcs.length) {
                resolve(results);
            }
        }
        run();
    });
}

function throttlePromisesRec(funcs, max) {
    return new Promise((resolve, reject) => {
        let concurrentCount = 0;
        let latestCalledFuncIndex = -1;
        let resultCount = 0;
        let hasError = false;
        const result = [];
        const fetchNext = () => {
            // already done
            if (hasError || latestCalledFuncIndex === funcs.length - 1) {
                return;
            }
            // get the func
            // trigger
            // update the count
            // if ok for next fetch, trigger next
            const nextFuncIndex = latestCalledFuncIndex + 1;
            const next = funcs[nextFuncIndex];
            concurrentCount += 1;
            latestCalledFuncIndex += 1;
            next().then(
                (data) => {
                    result[nextFuncIndex] = data;
                    resultCount += 1;
                    concurrentCount -= 1;
                    if (resultCount === funcs.length) {
                        resolve(result);
                        return;
                    }
                    fetchNext();
                },
                (err) => {
                    hasError = true;
                    reject(err);
                }
            );

            if (concurrentCount < max) {
                fetchNext();
            }
        };
        fetchNext();
    });
}

function throttlePromises(funcs, max) {
    if (funcs.length == 0) return Promise.resolve([]);
    let lastIndex = 0;
    let pendingCount = 0;
    const result = new Array(funcs.length).fill(undefined);
    return new Promise((resolve, reject) => {
        function runBatch() {
            while (lastIndex < result.length && pendingCount < max) {
                const storeData = (index) => (data) => {
                    result[index] = data;
                };
                const scheduleOrFinish = () => {
                    pendingCount--;

                    if (lastIndex < result.length) return runBatch();
                    if (pendingCount === 0) return resolve(result);
                };
                const fn = funcs[lastIndex];
                fn()
                    .then(storeData(lastIndex))
                    .catch(reject)
                    .finally(scheduleOrFinish);
                lastIndex++;
                pendingCount++;
            }
        }

        runBatch();
    });
}

const throttlePromisesIterative = (fns, max) =>
    new Promise(async (resolve, reject) => {
        const res = [];
        for (let i = 0; i < fns.length; i += max) {
            try {
                const chunk = fns.slice(i, i + max);
                const promises = chunk.map((fn) => fn());
                res.push(...(await Promise.all(promises)));
            } catch (e) {
                return reject(e);
            }
        }
        return resolve(res);
    });

const throttlePromisesRecursive = async (
    fns,
    max,
    res = [],
    chunk = fns.slice(0, max)
) => {
    if (fns.length) {
        try {
            return await throttlePromises(fns.slice(max), max, [
                ...res,
                ...(await Promise.all(chunk.map((fn) => fn()))),
            ]);
        } catch (e) {
            return Promise.reject(e);
        }
    }
    return Promise.resolve(res);
};

// Test the implementation
function createMockAPI(id, delay = Math.random() * 1000) {
    return () =>
        new Promise((resolve) => {
            console.log(`Starting API call ${id}`);
            setTimeout(() => {
                console.log(`Completed API call ${id}`);
                resolve(`Result from API ${id}`);
            }, delay);
        });
}

// Create 10 mock API functions
const callApis = Array.from({ length: 10 }, (_, i) => createMockAPI(i + 1));

throttlePromisesAsync(callApis, 3)
    .then((results) => {
        console.log("All results:", results);
    })
    .catch((error) => {
        console.error("Error:", error);
    });
