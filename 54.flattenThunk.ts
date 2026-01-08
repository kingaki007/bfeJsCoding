/**
 * Suppose we have a Callback type:
 *
 * type Callback = (error: Error, result: any | Thunk) => void
 *
 * A Thunk is a function that takes a Callback as a parameter:
 *
 * type Thunk = (callback: Callback) => void
 *
 * Example thunks:
 *
 * const func1 = (cb) => {
 *   setTimeout(() => cb(null, 'ok'), 10)
 * }
 * const func2 = (cb) => {
 *   setTimeout(() => cb(null, func1), 10)
 * }
 * const func3 = (cb) => {
 *   setTimeout(() => cb(null, func2), 10)
 * }
 *
 * In the above example, three functions are chained: func3 → func2 → func1,
 * but they don't work without some glue.
 *
 * Implement flattenThunk() to glue them up and return a new thunk:
 *
 * flattenThunk(func3)((error, data) => {
 *   console.log(data) // 'ok'
 * })
 *
 * Note:
 * - Once an error occurs, the rest of the uncalled functions should be skipped.
 */
// Implementation of flattenThunk
function flattenThunk(thunk) {
    return function (callback) {
        function next(err, result) {
            if (err) return callback(err);
            if (typeof result === "function") {
                // result is a Thunk, call it recursively
                result(next);
            } else {
                callback(undefined, result);
            }
        }
        thunk(next);
    };
}

/**
 * @param {Thunk} thunk
 * @return {Thunk}
 */
function flattenThunkShort(thunk) {
    // your code here
    return function (cb) {
        function wrapper(err, res) {
            typeof res === "function" ? res(wrapper) : cb(err, res);
        }
        thunk(wrapper);
    };
}

function flattenThunkRec(thunk) {
    return function (cb) {
        thunk((err, res) => {
            typeof res === "function" ? flattenThunkRec(res)(cb) : cb(err, res);
        });
    };
}

const func1 = (cb) => {
    setTimeout(() => cb(null, "ok"), 10);
};
const func2 = (cb) => {
    setTimeout(() => cb(null, func1), 10);
};
const func3 = (cb) => {
    setTimeout(() => cb(null, func2), 10);
};

flattenThunk(func3)((error, data) => {
    console.log(data); // 'ok'
});
