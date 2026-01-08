/**
 * Python supports negative list index , while JavaScript doesn't.

Can you write a wrapper function to make negative array index possible?

const originalArr = [1,2,3]
const arr = wrap(originalArr)
arr[0] // 1
arr[1] // 2
arr[2] // 3
arr[3] // undefined
arr[-1] // 3
arr[-2] // 2
arr[-3] // 1
arr[-4] // undefined
All methods on arr should be applied to the original array, which means

arr.push(4)
arr[3] // 4
originalArr[3] // 4
arr.shift()
arr[0] // 2
originalArr[0] // 2
arr.bfe = 'bfe'
originalArr.bfe // 'bfe'
arr[-1] = 5
arr // [2,3,5]
originalArr // [2,3,5]
originalArr[2] = 6
arr // [2,3,6]
originalArr // [2,3,6]
 */

function wrap<T>(originalArray: T[]): T[] & Record<string, any> {
    return new Proxy(originalArray, {
        get(target, prop, receiver) {
            // Handle numeric properties (array indices)
            if (typeof prop === "string" && /^-?\d+$/.test(prop)) {
                const index = parseInt(prop);
                if (index < 0) {
                    // Convert negative index to positive
                    const positiveIndex = target.length + index;
                    return positiveIndex >= 0
                        ? target[positiveIndex]
                        : undefined;
                }
            }

            // For all other properties, delegate to the original array
            return Reflect.get(target, prop, receiver);
        },

        set(target, prop, value, receiver) {
            // Handle numeric properties (array indices)
            if (typeof prop === "string" && /^-?\d+$/.test(prop)) {
                const index = parseInt(prop);
                if (index < 0) {
                    // Convert negative index to positive
                    const positiveIndex = target.length + index;
                    if (positiveIndex >= 0) {
                        target[positiveIndex] = value;
                        return true;
                    }
                    return false;
                }
            }

            // For all other properties, delegate to the original array
            return Reflect.set(target, prop, value, receiver);
        },
    });
}

// Test the implementation
const originalArr = [1, 2, 3];
const arr = wrap(originalArr) as number[] & Record<string, any>;

console.log("Testing basic access:");
console.log(arr[0]); // 1
console.log(arr[1]); // 2
console.log(arr[2]); // 3
console.log(arr[3]); // undefined
console.log(arr[-1]); // 3
console.log(arr[-2]); // 2
console.log(arr[-3]); // 1
console.log(arr[-4]); // undefined

console.log("\nTesting array methods:");
arr.push(4);
console.log(arr[3]); // 4
console.log(originalArr[3]); // 4

arr.shift();
console.log(arr[0]); // 2
console.log(originalArr[0]); // 2

console.log("\nTesting property assignment:");
arr.bfe = "bfe";
console.log((originalArr as any).bfe); // 'bfe'

console.log("\nTesting negative index assignment:");
arr[-1] = 5;
console.log(arr); // [2,3,5]
console.log(originalArr); // [2,3,5]

console.log("\nTesting direct original array modification:");
originalArr[2] = 6;
console.log(arr); // [2,3,6]
console.log(originalArr); // [2,3,6]
