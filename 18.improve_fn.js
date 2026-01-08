// TODO: Do again
/**
 * // Given an input of array, 
// which is made of items with >= 3 properties
let items = [
  {color: 'red', type: 'tv', age: 18}, 
  {color: 'silver', type: 'phone', age: 20},
  {color: 'blue', type: 'book', age: 17}
] 
// an exclude array made of key value pair
const excludes = [ 
  {k: 'color', v: 'silver'}, 
  {k: 'type', v: 'tv'}, 
  ...
] 
function excludeItems(items, excludes) { 
  excludes.forEach( pair => { 
    items = items.filter(item => item[pair.k] === item[pair.v])
  })
 
  return items
}
What does this function excludeItems do?
Is this function working as expected ?
What is the time complexity of this function?
How would you optimize it ?
note

we only judge by the result, not the time cost. please submit the best approach you can.
 */
let items = [
    { color: "red", type: "tv", age: 18 },
    { color: "silver", type: "phone", age: 20 },
    { color: "blue", type: "book", age: 17 },
];
// an exclude array made of key value pair
const excludes = [
    { k: "color", v: "silver" },
    { k: "type", v: "tv" },
];
/*
What does this function excludeItems do?
- It is intended to remove (exclude) items from the input array that match any key-value pair in the excludes array.

Is this function working as expected?
- No, it does not work as expected. The current implementation keeps only items that match ALL exclude pairs, instead of removing items that match ANY exclude pair. It actually acts as a filter-in, not filter-out.

What is the time complexity of this function?
- The current implementation is O(M*N), where M = excludes.length and N = items.length, because it filters the items array for each exclude pair.

How would you optimize it?
- The best approach is to filter out items that match ANY exclude pair in a single pass. Use a Set or Map for fast lookup if excludes is large.
*/

function excludeItems(items, excludes) {
    return items.filter(
        (item) => !excludes.some((pair) => item[pair.k] === pair.v)
    );
}

// Solution 2:
function excludeItems(items, excludes) {
    // Map<key, Set<value>>
    const excludeMap = new Map();
    for (const { k, v } of excludes) {
        if (!excludeMap.has(k)) {
            excludeMap.set(k, new Set());
        }
        excludeMap.get(k).add(v);
    }
    return items.filter((item) => {
        for (const [key, excludedValues] of excludeMap) {
            if (excludedValues.has(item[key])) {
                return false;
            }
        }
        return true;
    });
}
/* 
items: n
item properties: k
excludes: m
original algorithm Time Complexity:
items loop: O(n)
excludes loop: O(m)
total: O(n * m)
optimized algorithm Time Complexity:
Time Complexity:
excludes loop: O(m)
items loop: O(n)
excludeMap loop: O(k)
total: O(m + n * k)
and k is usually much smaller than m
*/
