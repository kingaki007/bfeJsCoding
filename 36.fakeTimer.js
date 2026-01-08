/**
 * setTimeout adds tasks into a task queue to be handled later; the timing is not accurate (Event Loop).
 *
 * This is OK in general web applications, but might be problematic in tests.
 *
 * For example, at 5. implement throttle() with leading & trailing option, we need to test the timer with a more accurate approach.
 *
 * Could you implement your own setTimeout() and clearTimeout() to be synchronous, so that they have accurate timing for tests? This is what FakeTimers are for.
 *
 * By "accurate", it means: suppose all functions cost no time, we start our function at time 0, then setTimeout(func1, 100) would schedule func1 exactly at 100.
 *
 * You need to replace Date.now() as well to provide the time.
 *
 * class FakeTimer {
 *   install() {
 *     // setTimeout(), clearTimeout(), and Date.now()
 *     // are replaced
 *   }
 *   uninstall() {
 *     // restore the original APIs
 *     // setTimeout(), clearTimeout() and Date.now()
 *   }
 *   tick() {
 *      // run all the scheduled functions in order
 *   }
 * }
 *
 * Your code is tested like this:
 *
 * const fakeTimer = new FakeTimer()
 * fakeTimer.install()
 * const logs = []
 * const log = (arg) => {
 *    logs.push([Date.now(), arg])
 * }
 * setTimeout(() => log('A'), 100)
 * // log 'A' at 100
 * const b = setTimeout(() => log('B'), 110)
 * clearTimeout(b)
 * // b is set but cleared
 * setTimeout(() => log('C'), 200)
 * expect(logs).toEqual([[100, 'A'], [200, 'C']])
 * fakeTimer.uninstall()
 *
 * Note:
 * Only Date.now() is used when judging your code; you can ignore other time-related APIs.
 */

class FakeTimer {
    constructor() {
        this._now = 0;
        this._queue = [];
        this._id = 1;
        this._originals = {};
    }

    install() {
        this._originals.setTimeout = globalThis.setTimeout;
        this._originals.clearTimeout = globalThis.clearTimeout;
        this._originals.DateNow = Date.now;

        const self = this;

        globalThis.setTimeout = function (fn, delay, ...args) {
            const id = self._id++;
            self._queue.push({
                id,
                fn: () => fn(...args),
                time: self._now + (delay || 0),
                cleared: false,
            });
            // Keep queue sorted by time
            self._queue.sort((a, b) => a.time - b.time || a.id - b.id);
            return id;
        };

        globalThis.clearTimeout = function (id) {
            const task = self._queue.find((t) => t.id === id);
            if (task) task.cleared = true;
        };

        Date.now = function () {
            return self._now;
        };
    }

    uninstall() {
        globalThis.setTimeout = this._originals.setTimeout;
        globalThis.clearTimeout = this._originals.clearTimeout;
        Date.now = this._originals.DateNow;
        this._now = 0;
        this._queue = [];
        this._id = 1;
    }

    tick(ms = Infinity) {
        const end = this._now + ms;
        while (true) {
            // Find the next task to run
            const next = this._queue.find((t) => !t.cleared && t.time <= end);
            if (!next) {
                this._now = end;
                break;
            }
            // Advance time to the task's scheduled time
            this._now = next.time;
            // Remove from queue
            this._queue = this._queue.filter((t) => t !== next);
            // Run the task
            next.fn();
        }
    }
}

// Solution 2
class FakeTimer {
    oldSetTimeout = () => {};
    oldClearTimeout = () => {};
    oldDateNow = () => {};
    tasks = [];
    time = 0;
    install() {
        this.oldSetTimeout = window.setTimeout;
        this.oldClearTimeout = window.clearTimeout;
        this.oldDateNow = Date.now;
        window.setTimeout = this.addTask.bind(this);
        window.clearTimeout = this.removeTask.bind(this);
        Date.now = () => this.time;
    }
    uninstall() {
        window.setTimeout = this.oldSetTimeout;
        window.clearTimeout = this.oldClearTimeout;
        Date.now = this.oldDateNow;
    }
    tick() {
        while (this.tasks.length) {
            const task = this.tasks.shift();
            this.time = task.time;
            task.func.call(task.func);
        }
    }
    addTask(func, time) {
        const id = Symbol();
        this.tasks.push({
            id,
            func,
            time: this.time + time,
        });
        this.tasks = this.tasks.sort((a, b) => a.time - b.time);
        return id;
    }
    removeTask(id) {
        const taskIdx = this.tasks.findIndex((item) => item.id === id);
        this.tasks.splice(taskIdx, 1);
    }
}

// Solution 3, using heap:
class Heap {
    #entries = null;
    #comparator = null;
    constructor(comparator, entries = []) {
        this.#comparator = comparator;
        this.#entries = entries;
        this.#build();
    }

    get size() {
        return this.#entries.length;
    }

    #build() {
        const lastIndex = this.size - 1;
        let index = Math.floor((lastIndex - 1) / 2);

        while (index >= 0) {
            this.#fixTopDown(index);
            index--;
        }
    }

    #fixTopDown(index) {
        while (index < this.size) {
            let priorityIndex = index;
            let leftIndex = 2 * index + 1;
            let rightIndex = 2 * index + 2;
            if (leftIndex < this.size) {
                const left = this.#entries[leftIndex];
                const priority = this.#entries[priorityIndex];
                if (this.#comparator(left, priority) < 0) {
                    priorityIndex = leftIndex;
                }
            }
            if (rightIndex < this.size) {
                const right = this.#entries[rightIndex];
                const priority = this.#entries[priorityIndex];
                if (this.#comparator(right, priority) < 0) {
                    priorityIndex = rightIndex;
                }
            }
            if (priorityIndex !== index) {
                [this.#entries[priorityIndex], this.#entries[index]] = [
                    this.#entries[index],
                    this.#entries[priorityIndex],
                ];
                index = priorityIndex;
            } else {
                break;
            }
        }
    }

    #fixBottomUp(index) {
        console.log(`fixBottomUp : ${index}`);
        while (index > 0) {
            console.log(`Inner index: ${index}`);
            const current = this.#entries[index];
            const parentIndex = Math.floor((index - 1) / 2);
            const parent = this.#entries[parentIndex];

            console.log(current);
            console.log(parent);
            if (this.#comparator(current, parent) < 0) {
                [this.#entries[index], this.#entries[parentIndex]] = [
                    this.#entries[parentIndex],
                    this.#entries[index],
                ];
                index = parentIndex;
            } else {
                break;
            }
        }
    }

    peek() {
        if (this.size) {
            return this.#entries[0];
        }
    }

    push(element) {
        this.#entries.push(element);
        const lastIndex = this.size - 1;
        this.#fixBottomUp(lastIndex);
    }

    pop() {
        if (this.size) {
            const priority = this.#entries[0];
            const lastIndex = this.size - 1;

            this.#entries[0] = this.#entries[lastIndex];
            this.#entries.length -= 1;

            if (this.size) {
                this.#fixTopDown(0);
            }

            return priority;
        }
    }

    delete(value) {
        const index = this.#entries.findIndex((entry) => entry === value);

        if (index !== -1) {
            this.#entries[index] = this.#entries[this.size - 1];
            this.#entries.length -= 1;
            if (index < this.#entries.length) {
                this.#fixBottomUp(index);
            }

            return true;
        }

        return false;
    }

    has(num) {
        return this.#entries.includes(num);
    }
    clear() {
        this.#entries.length = 0;
    }
}
const _setTimeout = window.setTimeout;
const _clearTimeout = window.clearTimeout;
const _now = Date.now;
let currentTime = 0;
class FakeTimer {
    install() {
        this.tasks = new Heap((a, b) => a.time - b.time);
        window.setTimeout = (fn, wait) => {
            const entry = {
                fn,
                time: currentTime + wait,
            };
            this.tasks.push(entry);
            return entry;
        };
        window.clearTimeout = (entry) => {
            this.tasks.delete(entry);
        };
        Date.now = () => currentTime;
    }

    uninstall() {
        // restore the original implementation of
        // window.setTimeout, window.clearTimeout, Date.now
        window.setTimeout = _setTimeout;
        window.clearTimeout = _clearTimeout;
        Date.now = _now;
        this.tasks.clear();
        currentTime = 0;
    }

    tick() {
        while (this.tasks.size) {
            const entry = this.tasks.pop();
            currentTime = entry.time;
            entry.fn();
        }
    }
}

// Solution 4:
class FakeTimer {
    constructor() {
        this.original = {
            setTimeout: window.setTimeout,
            clearTimeout: window.clearTimeout,
            dateNow: Date.now,
        };
        this.timerId = 1;
        this.currentTime = 0;
        this.queue = [];
    }
    install() {
        window.setTimeout = (cb, time, ...args) => {
            const id = this.timerId++;
            this.queue.push({
                id,
                cb,
                time: time + this.currentTime,
                args,
            });
            this.queue.sort((a, b) => a.time - b.time);
            return id;
        };
        window.clearTimeout = (removeId) => {
            this.queue = this.queue.filter(({ id }) => id !== removeId);
        };
        Date.now = () => {
            return this.currentTime;
        };
    }

    uninstall() {
        window.setTimeout = this.original.setTimeout;
        window.clearTimeout = this.original.clearTimeout;
        Date.now = this.original.dateNow;
    }

    tick() {
        while (this.queue.length) {
            const { cb, time, args } = this.queue.shift();
            this.currentTime = time;
            cb(...args);
        }
    }
}

const fakeTimer = new FakeTimer();
fakeTimer.install();
const logs = [];
const log = (arg) => {
    logs.push([Date.now(), arg]);
};
setTimeout(() => log("A"), 100);
// log 'A' at 100
const b = setTimeout(() => log("B"), 110);
clearTimeout(b);
// b is set but cleared
setTimeout(() => log("C"), 200);
console.log(logs); //[[100, "A"],[200, "C"],];
fakeTimer.uninstall();
