// class MyPromise {
//     #state = "pending";
//     #result = null;
//     #fulfillReactions = [];
//     #rejectReactions = [];
//     constructor(executor) {
//         const { resolve, reject } = this.#createResolvingFunctions();
//         try {
//             executor(resolve, reject);
//         } catch (e) {
//             reject(e);
//         }
//     }
//     #fulfill(value) {
//         if (this.#state !== "pending") {
//             return;
//         }
//         this.#result = value;
//         const fulfillReactions = this.#fulfillReactions;
//         this.#fulfillReactions = [];
//         this.#rejectReactions = [];
//         this.#state = "fulfilled";
//         for (const reaction of fulfillReactions) {
//             queueMicrotask(() => reaction(value));
//         }
//     }
//     #reject(reason) {
//         if (this.#state !== "pending") {
//             return;
//         }
//         this.#result = reason;
//         const rejectReactions = this.#rejectReactions;
//         this.#fulfillReactions = [];
//         this.#rejectReactions = [];
//         this.#state = "rejected";
//         for (const reaction of rejectReactions) {
//             queueMicrotask(() => reaction(reason));
//         }
//     }
//     #createResolvingFunctions() {
//         let isResolved = false;
//         return {
//             resolve: (resolution) => {
//                 if (!isResolved) {
//                     isResolved = true;
//                     if (resolution === this) {
//                         const reason = new TypeError(
//                             "Chaining cycle detected for promise"
//                         );
//                         this.#reject(reason);
//                         return;
//                     }
//                     if (
//                         typeof resolution === "object" &&
//                         resolution != null &&
//                         typeof resolution.then === "function"
//                     ) {
//                         const task = () => {
//                             const { resolve, reject } =
//                                 this.#createResolvingFunctions();
//                             try {
//                                 resolution.then(resolve, reject);
//                             } catch (e) {
//                                 reject(e);
//                             }
//                         };
//                         queueMicrotask(task);
//                     } else {
//                         this.#fulfill(resolution);
//                     }
//                 }
//             },
//             reject: (reason) => {
//                 if (!isResolved) {
//                     isResolved = true;
//                     this.#reject(reason);
//                 }
//             },
//         };
//     }
//     then(onFulfilled, onRejected) {
//         return new MyPromise((resolve, reject) => {
//             const fulfillReaction = () => {
//                 if (typeof onFulfilled === "function") {
//                     try {
//                         resolve(onFulfilled(this.#result));
//                     } catch (e) {
//                         reject(e);
//                     }
//                 } else {
//                     resolve(this.#result);
//                 }
//             };
//             const rejectReaction = () => {
//                 if (typeof onRejected === "function") {
//                     try {
//                         resolve(onRejected(this.#result));
//                     } catch (e) {
//                         reject(e);
//                     }
//                 } else {
//                     reject(this.#result);
//                 }
//             };

//             if (this.#state === "pending") {
//                 this.#fulfillReactions.push(fulfillReaction);
//                 this.#rejectReactions.push(rejectReaction);
//             } else if (this.#state === "fulfilled") {
//                 queueMicrotask(fulfillReaction);
//             } else {
//                 queueMicrotask(rejectReaction);
//             }
//         });
//     }
//     catch(callback) {
//         return this.then(undefined, callback);
//     }
//     static resolve(data) {
//         return new MyPromise((resolve) => resolve(data));
//     }
//     static reject(data) {
//         return new MyPromise((_, reject) => reject(data));
//     }
// }

// Polyfill for Promise

// class MyPromise {
//     #state = "pending";
//     #result = undefined;
//     #fulfillReactions = [];
//     #rejectReactions = [];

//     constructor(executor) {
//         const resolve = (value) => {
//             if (this.#state !== "pending") return;
//             if (value instanceof MyPromise) {
//                 value.then(resolve, reject);
//                 return;
//             }
//             this.#state = "fulfilled";
//             this.#result = value;
//             this.#fulfillReactions.forEach((fn) => queueMicrotask(fn));
//         };
//         const reject = (reason) => {
//             if (this.#state !== "pending") return;
//             this.#state = "rejected";
//             this.#result = reason;
//             this.#rejectReactions.forEach((fn) => queueMicrotask(fn));
//         };
//         try {
//             executor(resolve, reject);
//         } catch (e) {
//             reject(e);
//         }
//     }

//     then(onFulfilled, onRejected) {
//         return new MyPromise((resolve, reject) => {
//             const fulfillReaction = () => {
//                 try {
//                     if (typeof onFulfilled === "function") {
//                         const x = onFulfilled(this.#result);
//                         resolvePromise(resolve, reject, x);
//                     } else {
//                         resolve(this.#result);
//                     }
//                 } catch (e) {
//                     reject(e);
//                 }
//             };
//             const rejectReaction = () => {
//                 try {
//                     if (typeof onRejected === "function") {
//                         const x = onRejected(this.#result);
//                         resolvePromise(resolve, reject, x);
//                     } else {
//                         reject(this.#result);
//                     }
//                 } catch (e) {
//                     reject(e);
//                 }
//             };

//             if (this.#state === "pending") {
//                 this.#fulfillReactions.push(fulfillReaction);
//                 this.#rejectReactions.push(rejectReaction);
//             } else if (this.#state === "fulfilled") {
//                 queueMicrotask(fulfillReaction);
//             } else {
//                 queueMicrotask(rejectReaction);
//             }
//         });

//         // Helper to handle thenable resolution
//         function resolvePromise(resolve, reject, x) {
//             if (x === resolve || x === reject) {
//                 return reject(new TypeError("Chaining cycle detected"));
//             }
//             if (x instanceof MyPromise) {
//                 x.then(resolve, reject);
//             } else if (
//                 x &&
//                 (typeof x === "object" || typeof x === "function")
//             ) {
//                 let then;
//                 let called = false;
//                 try {
//                     then = x.then;
//                     if (typeof then === "function") {
//                         then.call(
//                             x,
//                             (y) => {
//                                 if (called) return;
//                                 called = true;
//                                 resolvePromise(resolve, reject, y);
//                             },
//                             (r) => {
//                                 if (called) return;
//                                 called = true;
//                                 reject(r);
//                             }
//                         );
//                     } else {
//                         resolve(x);
//                     }
//                 } catch (e) {
//                     if (!called) {
//                         called = true;
//                         reject(e);
//                     }
//                 }
//             } else {
//                 resolve(x);
//             }
//         }
//     }

//     catch(onRejected) {
//         return this.then(undefined, onRejected);
//     }

//     finally(onFinally) {
//         return this.then(
//             (value) => {
//                 if (typeof onFinally === "function") {
//                     return MyPromise.resolve(onFinally()).then(() => value);
//                 }
//                 return value;
//             },
//             (reason) => {
//                 if (typeof onFinally === "function") {
//                     return MyPromise.resolve(onFinally()).then(() => {
//                         throw reason;
//                     });
//                 }
//                 throw reason;
//             }
//         );
//     }

//     static resolve(value) {
//         if (value instanceof MyPromise) return value;
//         return new MyPromise((resolve) => resolve(value));
//     }

//     static reject(reason) {
//         return new MyPromise((_, reject) => reject(reason));
//     }

//     static all(promises) {
//         return new MyPromise((resolve, reject) => {
//             let results = [];
//             let count = 0;
//             let fulfilledCount = 0;
//             for (let i = 0; i < promises.length; i++) {
//                 ((i) => {
//                     MyPromise.resolve(promises[i]).then((value) => {
//                         results[i] = value;
//                         fulfilledCount++;
//                         if (fulfilledCount === promises.length) {
//                             resolve(results);
//                         }
//                     }, reject);
//                 })(i);
//                 count++;
//             }
//             if (count === 0) resolve([]);
//         });
//     }

//     static race(promises) {
//         return new MyPromise((resolve, reject) => {
//             for (let p of promises) {
//                 MyPromise.resolve(p).then(resolve, reject);
//             }
//         });
//     }
// }

// class MyPromise {
//     constructor(executorFn) {
//         this.promiseChain = [];
//         this.errorHandler = () => {};

//         this.onResolve = this.onResolve.bind(this);
//         this.onReject = this.onReject.bind(this);

//         executorFn(this.onResolve, this.onReject);
//     }

//     static resolve(value) {
//         return new MyPromise((resolve) => resolve(value));
//     }

//     static reject(reason) {
//         return new MyPromise((_, reject) => reject(reason));
//     }

//     then(fn) {
//         this.promiseChain.push(fn);
//         return this;
//     }

//     catch(fn) {
//         this.errorHandler = fn;
//         return this;
//     }

//     onResolve(val) {
//         let storedVal = val;

//         try {
//             this.promiseChain.forEach((fn) => fn(storedVal));
//         } catch (e) {
//             this.promiseChain = [];
//             this.onReject(e);
//         }
//     }

//     onReject(err) {
//         this.errorHandler(err);
//     }
// }

class MyPromise {
    constructor(executorFn) {
        this.promiseChain = [];
        this.errorHandler = () => {};

        // this.onResolve = this.onResolve.bind(this);
        // this.onReject = this.onReject.bind(this);

        executorFn(this.onResolve, this.onReject);
    }

    then(fn) {
        this.promiseChain.push(fn);
        return this;
    }

    catch(fn) {
        this.errorHandler = fn;
        return this;
    }

    onResolve = (val) => {
        let storedVal = val;

        try {
            this.promiseChain.forEach((fn) => fn(storedVal));
        } catch (e) {
            this.promiseChain = [];
            this.onReject(e);
        }
    };

    onReject = (err) => {
        this.errorHandler(err);
    };
}

const promise = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve("hi");
    }, 100);
});

const promise1 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        reject("hi");
    }, 100);
});

promise
    .then((res) => {
        console.log("success", res);
    })
    .then((r) => {
        return console.log("success", r);
    });

promise1
    .then((res) => console.log("success", res))
    .catch((e) => console.log("error:", e));

// const promise2 = MyPromise.resolve("4");
// promise2.then((res) => console.log("success", res));

/**
 * 
 * 
 * class MyPromise {
  #state = "pending";
  #result = null;
  #fulfillReactions = [];
  #rejectReactions = [];
  constructor(executor) {
    const {resolve, reject} = this.#createResolvingFunctions();
    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }
  #fulfill(value) {
    if (this.#state !== "pending") {
      return;
    }
    this.#result = value;
    const fulfillReactions = this.#fulfillReactions;
    this.#fulfillReactions = [];
    this.#rejectReactions = [];
    this.#state = "fulfilled";
    for (const reaction of fulfillReactions) {
      queueMicrotask(() => reaction(value));
    }
  }
  #reject(reason) {
    if (this.#state !== "pending") {
      return;
    }
    this.#result = reason;
    const rejectReactions = this.#rejectReactions;
    this.#fulfillReactions = [];
    this.#rejectReactions = [];
    this.#state = "rejected";
    for (const reaction of rejectReactions) {
      queueMicrotask(() => reaction(reason));
    }
  }
  #createResolvingFunctions() {
    let isResolved = false;
    return {
      resolve: (resolution) => {
        if (!isResolved) {
          isResolved = true;
          if (resolution === this) {
            const reason = new TypeError(
              "Chaining cycle detected for promise"
            );
            this.#reject(reason);
            return;
          }
          if (
            typeof resolution === "object" &&
            resolution != null &&
            typeof resolution.then === "function"
          ) {
            const task = () => {
              const {resolve, reject} = this.#createResolvingFunctions();
              try {
                resolution.then(
                  resolve,
                  reject
                );
              } catch (e) {
                reject(e);
              }
            };
            queueMicrotask(task);
          } else {
            this.#fulfill(resolution);
          }
        }
      },
      reject: (reason) => {
        if (!isResolved) {
          isResolved = true;
          this.#reject(reason);
        }
      },
    };
  }
  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const fulfillReaction = () => {
        if (typeof onFulfilled === 'function') {
          try {
            resolve(onFulfilled(this.#result))
          } catch (e) {
            reject(e);
          }
        } else {
          resolve(this.#result)
        }
      }
      const rejectReaction = () => {
        if (typeof onRejected === 'function') {
          try {
            resolve(onRejected(this.#result))
          } catch (e) {
            reject(e);
          }
        } else {
          reject(this.#result)
        }
      }
      
      if (this.#state === "pending") {
        this.#fulfillReactions.push(fulfillReaction);
        this.#rejectReactions.push(rejectReaction);
      } else if (this.#state === "fulfilled") {
        queueMicrotask(fulfillReaction)
      } else {
        queueMicrotask(rejectReaction)
      }
    })
  }
  catch(callback) {
    return this.then(undefined, callback);
  }
  static resolve(data) {
    return new MyPromise((resolve) => resolve(data));
  }
  static reject(data) {
    return new MyPromise((_, reject) => reject(data));
  }
}
 * 
 * 
 * 
 */

/**
 * const PENDING   = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED  = 'REJECTED';

class MyPromise {
  constructor(executor) {
    this.state = PENDING;
    this.value = undefined;
    this.handlers = []; // { onFulfilled, onRejected, resolve, reject }

    const resolve = (value) => {
      this.updateState(FULFILLED, value);
    };

    const reject = (reason) => {
      this.updateState(REJECTED, reason);
    };

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  updateState(state, value) {
    if (this.state !== PENDING) return;

    this.state = state;
    this.value = value;
    this.processHandlers();
  }

  processHandlers() {
    if (this.state === PENDING) return;

    queueMicrotask(() => {
      while (this.handlers.length) {
        const { onFulfilled, onRejected, resolve, reject } = this.handlers.shift();

        try {
          if (this.state === FULFILLED) {
            if (typeof onFulfilled === 'function') {
              const result = onFulfilled(this.value);
              resolve(result);
            } else {
              resolve(this.value);
            }
          } else if (this.state === REJECTED) {
            if (typeof onRejected === 'function') {
              const result = onRejected(this.value);
              resolve(result);
            } else {
              reject(this.value);
            }
          }
        } catch (err) {
          reject(err);
        }
      }
    });
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      this.handlers.push({ onFulfilled, onRejected, resolve, reject });
      this.processHandlers();
    });
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  // nice-to-have helpers
  static resolve(value) {
    return new MyPromise((resolve) => resolve(value));
  }

  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason));
  }
}
 */
