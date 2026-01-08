/**
 * Can you create a range(from, to) which makes following work?

for (let num of range(1, 4)) {
  console.log(num)  
}
// 1
// 2
// 3
// 4
This is a simple one, could you think more fancy approaches other than for-loop?

Notice that you are not required to return an array, but something iterable would be fine
 */

/**
 * @param {integer} from
 * @param {integer} to
 */
function range(from, to) {
    const arr = [];
    for (let i = from; i <= to; i++) {
        arr.push(i);
    }
    return arr;
}

function* range(from, to) {
    for (let num = from; num <= to; num++) {
        yield num;
    }
}

function range(from, to) {
    return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}

function range(from, to) {
    return [...Array(to - from + 1)].map((_, i) => from + i);
}

function range(from, to) {
    return {
        // iterable protocol
        [Symbol.iterator]() {
            // iterator protocol
            return {
                next() {
                    return {
                        done: from > to,
                        value: from++,
                    };
                },
            };
        },
    };
}

// 4. actualy geneator also implements iterable protocol
function range(from, to) {
    return (function* () {
        while (from <= to) {
            yield from++;
        }
    })(from, to);
}
