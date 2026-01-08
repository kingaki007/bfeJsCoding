class AggregateError extends Error {
    constructor(errors, message) {
        super(message);
        this.name = "AggregateError";
        this.errors = errors;
    }
}

/**
 * @param {Array<Promise>} promises
 * @return {Promise}
 */
function any(promises) {
    // your code here
    // AggregateError: No Promise in Promise.any was resolved
    if (!promises.length) throw new AggregateError("No Promise passed");
    return new Promise((resolve, reject) => {
        let settledCount = 0,
            errors = [];
        promises.forEach((promise, index) =>
            promise
                .then((data) => resolve(data))
                .catch((err) => {
                    errors[index] = err;
                    if (++settledCount === promises.length)
                        reject(
                            new AggregateError(
                                "No Promise in Promise.any was resolved",
                                errors
                            )
                        );
                })
        );
    });
}
