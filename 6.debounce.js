/**
 * Debounce is a common technique used in Web Application, in most cases using lodash solution would be a good choice.

could you implement your own version of basic debounce()?

In case you forgot, debounce(func, delay) will returned a debounced function, which delays the invoke.

Here is an example.

Before debouncing we have a series of calling like

─ A ─ B ─ C ─ ─ D ─ ─ ─ ─ ─ ─ E ─ ─ F ─ G 
After debouncing at wait time of 3 dashes

─ ─ ─ ─ ─ ─ ─ ─ D ─ ─ ─ ─ ─ ─ ─ ─ ─ G 
notes

please follow above spec. the behavior might not be exactly the same as lodash.debounce()

because window.setTimeout and window.clearTimeout are not accurate in browser environment, they are replaced to other implementation when judging your code. They still have the same interface, and internally keep track of the timing for testing purpose.

Something like below will be used to do the test.

let currentTime = 0
const run = (input) => {
  currentTime = 0
  const calls = []
  const func = (arg) => {
     calls.push(`${arg}@${currentTime}`)
  }
  const debounced = debounce(func, 3)
  input.forEach((call) => {
     const [arg, time] = call.split('@')
     setTimeout(() => debounced(arg), time)
  })
  return calls
}
expect(run(['A@0', 'B@2', 'C@3'])).toEqual(['C@5'])
 */

// export const debounce = (fn, wait) => {
//     let timer;
//     return function (...args) {
//         clearTimeout(timer);
//         timer = setTimeout(() => {
//             fn.call(this, ...args);
//         }, wait);
//     };
// };

export const debounce = (fn, wait) => {
    let timer;
    return function (...args) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn.call(this, ...args);
        }, wait);
    };
};

function debounce(callback, delay) {
    let timeoutId;
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            callback(...args);
        }, delay);
    };
}

/**
 * Fancy debounce: supports options for leading/trailing, maxWait, and cancel/flush methods.
 */
export function fancyDebounce(fn, wait, options = {}) {
    let timer = null;
    let lastArgs, lastThis, result;
    let lastCallTime = 0;
    let lastInvokeTime = 0;
    let maxWaitTimer = null;

    const { leading = false, trailing = true, maxWait } = options;

    function invokeFunc(time) {
        lastInvokeTime = time;
        result = fn.apply(lastThis, lastArgs);
        lastArgs = lastThis = null;
        return result;
    }

    function startTimer(pendingFunc, wait) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(pendingFunc, wait);
    }

    function shouldInvoke(time) {
        const sinceLastCall = time - lastCallTime;
        const sinceLastInvoke = time - lastInvokeTime;
        return (
            lastCallTime === 0 ||
            sinceLastCall >= wait ||
            sinceLastCall < 0 ||
            (maxWait && sinceLastInvoke >= maxWait)
        );
    }

    function trailingEdge(time) {
        timer = null;
        if (trailing && lastArgs) {
            return invokeFunc(time);
        }
        lastArgs = lastThis = null;
        return result;
    }

    function debounced(...args) {
        const now = Date.now();
        const isInvoking = shouldInvoke(now);

        lastArgs = args;
        lastThis = this;
        lastCallTime = now;

        if (isInvoking) {
            if (timer === null) {
                if (leading) {
                    return invokeFunc(now);
                }
                if (maxWait) {
                    startMaxWait(now);
                }
            }
            if (maxWait && !maxWaitTimer) {
                startMaxWait(now);
            }
        }
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => trailingEdge(Date.now()), wait);

        return result;
    }

    function startMaxWait(now) {
        if (maxWaitTimer) clearTimeout(maxWaitTimer);
        maxWaitTimer = setTimeout(() => {
            if (timer) clearTimeout(timer);
            trailingEdge(Date.now());
        }, maxWait);
    }

    debounced.cancel = function () {
        if (timer) clearTimeout(timer);
        if (maxWaitTimer) clearTimeout(maxWaitTimer);
        timer = maxWaitTimer = null;
        lastArgs = lastThis = null;
    };

    debounced.flush = function () {
        if (timer) {
            trailingEdge(Date.now());
            clearTimeout(timer);
            timer = null;
        }
        if (maxWaitTimer) {
            clearTimeout(maxWaitTimer);
            maxWaitTimer = null;
        }
        return result;
    };

    return debounced;
}

// This fancyDebounce function supports:

// leading (invoke at start)
// trailing (invoke at end, default)
// maxWait (guaranteed max delay)
// .cancel() and .flush() methods
const debounced = fancyDebounce(fn, 200, {
    leading: true,
    trailing: true,
    maxWait: 1000,
});
