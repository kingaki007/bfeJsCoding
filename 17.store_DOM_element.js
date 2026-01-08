// TODO: Do again
/**
 * We have Map in es6, so we could use any data as key, such as DOM element.

const map = new Map()
map.set(domNode, somedata)
What if we need to support old JavaScript env like es5, how would you create your own Node Store as above?

You are asked to implement a Node Store, which supports DOM element as key.

class NodeStore {
  set(node, value) {
  }
  
  get(node) {
  }
  
  has(node) {
  }
}
Map is disabled when judging your code, it is against the goal of practicing.
You can create a simple general Map polyfill. Or since you are asked to support specially for DOM element, what is special about DOM element?
What is the Time / Space cost of your solution?
 */

/**
 * Solution:
 * Besides Map, we can use Array, Object or Set as a collection data type.
 * But Object only allows string, number and symbol as property keys,
 * and in Set we are only able to know the existence of an element.
 * Array seems to be most promising.
 *
 * If we put all possible keys in an Array,
 * then we can get the indices for each key,
 * and these indices can be used to retrieve values from another Array.
 *
 */
// class NodeStore {
//     constructor() {
//         this.keys = [];
//         this.values = [];
//     }
//     /**
//      * @param {Node} node
//      * @param {any} value
//      */
//     set(node, value) {
//         const index = this.keys.indexOf(node);
//         if (index === -1) {
//             this.keys.push(node);
//             this.values.push(value);
//         } else {
//             this.values[index] = value;
//         }
//     }
//     /**
//      * @param {Node} node
//      * @return {any}
//      */
//     get(node) {
//         const index = this.keys.indexOf(node);
//         if (index === -1) {
//             return null;
//         } else {
//             return this.values[index];
//         }
//     }

//     /**
//      * @param {Node} node
//      * @return {Boolean}
//      */
//     has(node) {
//         return this.keys.includes(node);
//     }

//     delete(node) {
//         const index = this.keys.indexOf(node);
//         if (index === -1) {
//             return false;
//         } else {
//             const { keys, values } = this;
//             const lastIndex = keys.length - 1;
//             [keys[index], keys[lastIndex]] = [keys[lastIndex], keys[index]];
//             keys.pop()[(values[index], values[lastIndex])] = [
//                 values[lastIndex],
//                 values[index],
//             ];
//             values.pop();
//         }
//     }
// }

// Solution 2: collate 2 arrays in one
// class NodeStore {
//   constructor() {
//     this.pairs = [];
//   }
//   set(node, value) {
//     const index = this.pairs.findIndex(([key]) => key === node);
//     if (index === -1) {
//       this.pairs.push([node, value]);
//     } else {
//       this.pairs[index][1] = value;
//     }
//   }
//   get(node) {
//     const index = this.pairs.findIndex(([key]) => key === node);
//     if (index === -1) {
//       return null;
//     } else {
//       return this.pairs[index][1];
//     }
//   }
//   has(node) {
//     return this.pairs.some(([key]) => key === node);
//   }
// }

/**
 *
 * Solution 3:
 *
 * Our solution works as a general Map polyfill,
 * but the question only requires us to handle DOM elements.
 * And DOM elements are objects so we can actually just set the value directly on the elements.
 * We need to use Symbol to avoid key collision.
 *
 */
// class NodeStore {
//     static KEY = Symbol.for("nodestore");
//     set(node, value) {
//         node[NodeStore.KEY] = value;
//     }
//     get(node) {
//         return node[NodeStore.KEY];
//     }
//     has(node) {
//         return NodeStore.KEY in node;
//     }
// }

// Soltion 4:
// Make solution 3 less intrusive
class NodeStore {
    static KEY = Symbol.for("nodestore");
    set(node, value) {
        // the key is now NOT enumerable, safer
        console.log(NodeStore.KEY, node);
        Object.defineProperty(node, NodeStore.KEY, {
            value,
            writable: false,
            configurable: true,
        });
        console.log(NodeStore.KEY, node);
    }
    get(node) {
        console.log(node[NodeStore.KEY]);
        return node[NodeStore.KEY];
    }
    has(node) {
        return NodeStore.KEY in node;
    }
}

const node = document.getElementById("abc");
const node1 = document.getElementById("abc");
const node2 = document.getElementById("def");
const nodeStore = new NodeStore();
nodeStore.set(node, "1234");
nodeStore.set(node2, "234");
console.log(nodeStore.get(node));
console.log(nodeStore.has(node));
console.log(nodeStore.get(node2));
console.log(nodeStore.has(node2));
console.log(nodeStore.get(node1));
console.log(nodeStore.has(node1));
