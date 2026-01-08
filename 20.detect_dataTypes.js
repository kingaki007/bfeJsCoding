// TODO: DO again
/**
 * 20. Detect data type in JavaScript

This is an easy problem.

For all the basic data types in JavaScript, how could you write a function to detect the type of arbitrary data?

Besides basic types, you need to also handle also commonly used complex data type including Array, ArrayBuffer, Map, Set, Date and Function

The goal is not to list up all the data types but to show us how to solve the problem when we need to.

The type should be lowercase

detectType(1) // 'number'
detectType(new Map()) // 'map'
detectType([]) // 'array'
detectType(null) // 'null'
// more in judging step
 */
function detectType(data) {
    // your code here
    // if (data instanceof FileReader) return "object";
    // return Object.prototype.toString
    //     .call(data)
    //     .slice(1, -1)
    //     .split(" ")[1]
    //     .toLowerCase();
    return Object.prototype.toString.call(data).slice(8, -1).toLowerCase();
}

console.log(detectType(1)); // 'number'
console.log(detectType(new Map())); // 'map'
console.log(detectType([])); // 'array'
console.log(detectType(null)); // 'null'
// console.log(detectType(new FileReader())); // ''
