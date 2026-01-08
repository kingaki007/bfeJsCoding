class MyPromise {
    constructor(executor) {
        // Promise states: 'pending', 'fulfilled', 'rejected'
        this.state = "pending";
        this.value = undefined;
        this.reason = undefined;

        // Arrays to store handlers when promise is still pending
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];

        const resolve = (value) => {
            if (this.state === "pending") {
                this.state = "fulfilled";
                this.value = value;
                // Execute all queued fulfilled handlers
                this.onFulfilledCallbacks.forEach((callback) =>
                    callback(value)
                );
            }
        };

        const reject = (reason) => {
            if (this.state === "pending") {
                this.state = "rejected";
                this.reason = reason;
                // Execute all queued rejected handlers
                this.onRejectedCallbacks.forEach((callback) =>
                    callback(reason)
                );
            }
        };

        try {
            // Execute the executor function immediately
            executor(resolve, reject);
        } catch (error) {
            // If executor throws, reject the promise
            reject(error);
        }
    }

    then(onFulfilled, onRejected) {
        // Always return a new promise for chaining
        return new MyPromise((resolve, reject) => {
            const handleFulfilled = (value) => {
                // Use setTimeout to ensure asynchronous execution
                setTimeout(() => {
                    try {
                        if (typeof onFulfilled === "function") {
                            const result = onFulfilled(value);
                            // Handle promise resolution procedure
                            this.resolvePromise(result, resolve, reject);
                        } else {
                            // If onFulfilled is not a function, pass through the value
                            resolve(value);
                        }
                    } catch (error) {
                        reject(error);
                    }
                }, 0);
            };

            const handleRejected = (reason) => {
                setTimeout(() => {
                    try {
                        if (typeof onRejected === "function") {
                            const result = onRejected(reason);
                            // Even if this was a rejection handler, if it returns normally,
                            // the new promise should be fulfilled
                            this.resolvePromise(result, resolve, reject);
                        } else {
                            // If onRejected is not a function, pass through the rejection
                            reject(reason);
                        }
                    } catch (error) {
                        reject(error);
                    }
                }, 0);
            };

            // Handle based on current promise state
            if (this.state === "fulfilled") {
                handleFulfilled(this.value);
            } else if (this.state === "rejected") {
                handleRejected(this.reason);
            } else {
                // Promise is still pending, queue the handlers
                this.onFulfilledCallbacks.push(handleFulfilled);
                this.onRejectedCallbacks.push(handleRejected);
            }
        });
    }

    // Helper method to handle promise resolution procedure
    resolvePromise(result, resolve, reject) {
        if (result instanceof MyPromise) {
            // If result is a promise, adopt its state
            result.then(resolve, reject);
        } else {
            // If result is a regular value, fulfill with it
            resolve(result);
        }
    }

    catch(onRejected) {
        // catch is just syntactic sugar for then(null, onRejected)
        return this.then(null, onRejected);
    }

    // Static method to create a fulfilled promise
    static resolve(value) {
        if (value instanceof MyPromise) {
            return value;
        }
        return new MyPromise((resolve) => {
            resolve(value);
        });
    }

    // Static method to create a rejected promise
    static reject(reason) {
        return new MyPromise((resolve, reject) => {
            reject(reason);
        });
    }

    // Bonus: finally method
    finally(onFinally) {
        return this.then(
            (value) => MyPromise.resolve(onFinally()).then(() => value),
            (reason) =>
                MyPromise.resolve(onFinally()).then(() => {
                    throw reason;
                })
        );
    }
}

// Basic usage
const promise1 = new MyPromise((resolve, reject) => {
    setTimeout(() => resolve("Hello!"), 1000);
});

promise1
    .then((value) => {
        console.log(value); // 'Hello!' after 1 second
        return "World!";
    })
    .then((value) => {
        console.log(value); // 'World!'
    });

// Error handling
const promise2 = new MyPromise((resolve, reject) => {
    setTimeout(() => reject("Something went wrong"), 500);
});

promise2.catch((error) => {
    console.log("Caught:", error); // 'Caught: Something went wrong'
});

// Static methods
MyPromise.resolve("Immediate value").then((value) => console.log(value)); // 'Immediate value'

MyPromise.reject("Immediate error").catch((error) =>
    console.log("Error:", error)
); // 'Error: Immediate error'

// Chaining with promises
new MyPromise((resolve) => resolve(1))
    .then(
        (value) =>
            new MyPromise((resolve) =>
                setTimeout(() => resolve(value * 2), 100)
            )
    )
    .then((value) => console.log(value)); // 2

/**
 * 
 * Key features implemented:

State Management: Proper state transitions (pending → fulfilled/rejected)
Asynchronous Execution: All handlers execute asynchronously using setTimeout
Chaining: Each .then() returns a new promise
Error Propagation: Errors bubble through the chain until caught
Promise Resolution: Properly handles when handlers return other promises
Static Methods: resolve() and reject() for creating pre-settled promises
This implementation covers the core Promise functionality and should handle most use cases you'd encounter in practice!
 * 
 * 
 */
