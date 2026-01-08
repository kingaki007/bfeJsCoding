/**
 * Given an array containing all kinds of data, please implement a function deduplicate() to remove the duplicates.

You should modify the array in place. Order doesn't matter.

What is time & space cost of your approach?
 */

/**
 * @param {any[]} arr
 */
function deduplicate(arr) {
    // Use Set for fast lookup and handle all data types
    // including objects and arrays via string serialization
    const seen = new Set();
    let writeIndex = 0;

    for (let readIndex = 0; readIndex < arr.length; readIndex++) {
        const item = arr[readIndex];
        // For primitives, use direct value
        // For objects/arrays, use JSON string representation
        const key =
            item && typeof item === "object" ? JSON.stringify(item) : item;

        if (!seen.has(key)) {
            // Move unique items to front of array
            if (writeIndex !== readIndex) {
                arr[writeIndex] = item;
            }
            seen.add(key);
            writeIndex++;
        }
    }

    // Truncate array to remove duplicates
    arr.length = writeIndex;
    return arr;
}

// O(nlogn) time
/**
 * @param {any[]} arr
 */
const deduplicate1 = (arr) => {
    arr.sort();
    let i = 0;
    for (let j = 1; j < arr.length; j++) {
        if (arr[i] !== arr[j]) {
            i++;
            arr[i] = arr[j];
        }
    }
    arr.splice(i + 1);
};

// O(N**2)
/**
 * @param {any[]} arr
 */
function deduplicate(arr) {
    for (let i = arr.length - 1; i >= 0; ) {
        let last = arr.pop();
        if (arr.indexOf(last) === -1) {
            arr.unshift(last);
        }
        i--;
    }
}

// Primitives
console.log(deduplicate([1, 2, 2, 3, 1])); // [1, 2, 3]

// Mixed types
console.log(deduplicate([1, "1", true, true, 1])); // [1, '1', true]

// Objects
console.log(deduplicate([{ a: 1 }, { a: 1 }, { b: 2 }])); // [{a:1}, {b:2}]

// Arrays
console.log(deduplicate([[1], [1], [2]])); // [[1], [2]]

// Nullish values
console.log(deduplicate([null, undefined, null])); // [null, undefined]
