// TODO: Do again

/**
 * Given two same DOM tree A, B, and an Element a in A, find the corresponding Element b in B.

By corresponding, we mean a and b have the same relative position to their DOM tree root.

follow up

This could be a problem on general Tree structure with only children.

Could you solve it recursively and iteratively?

Could you solve this problem with special DOM api for better performance?

What are the time cost for each solution?
 */

/**
 * Recursive solution: Traverse both trees in parallel.
 * @param {Node} rootA - root of tree A
 * @param {Node} rootB - root of tree B
 * @param {Node} targetA - target node in tree A
 * @returns {Node|null} - corresponding node in tree B
 */
function findCorrespondingNodeRecursive(rootA, rootB, targetA) {
    if (rootA === targetA) return rootB;
    for (let i = 0; i < rootA.childNodes.length; i++) {
        const found = findCorrespondingNodeRecursive(
            rootA.childNodes[i],
            rootB.childNodes[i],
            targetA
        );
        if (found) return found;
    }
    return null;
}

/**
 * Iterative solution: BFS traversal in parallel.
 */
function findCorrespondingNodeIterative(rootA, rootB, targetA) {
    const queueA = [rootA];
    const queueB = [rootB];
    while (queueA.length) {
        const nodeA = queueA.shift();
        const nodeB = queueB.shift();
        if (nodeA === targetA) return nodeB;
        for (let i = 0; i < nodeA.childNodes.length; i++) {
            queueA.push(nodeA.childNodes[i]);
            queueB.push(nodeB.childNodes[i]);
        }
    }
    return null;
}

/**
 * DOM API solution: Use Node's .isSameNode() and .compareDocumentPosition() for better performance if available.
 * Or, use the path from root to targetA, then follow the same path in tree B.
 */
function getPathFromRoot(root, target) {
    const path = [];
    let node = target;
    while (node !== root) {
        const parent = node.parentNode;
        if (!parent) return null;
        const idx = Array.prototype.indexOf.call(parent.childNodes, node);
        path.unshift(idx);
        node = parent;
    }
    return path;
}
function findCorrespondingNodeByPath(rootB, path) {
    let node = rootB;
    for (const idx of path) {
        node = node.childNodes[idx];
    }
    return node;
}
// Usage:
// const path = getPathFromRoot(rootA, targetA);
// const nodeB = findCorrespondingNodeByPath(rootB, path);

/**
 * Time complexity:
 * - Recursive/Iterative: O(N), where N is the number of nodes in the tree (worst case, must traverse all nodes).
 * - Path-based: O(H), where H is the height of the tree (finding path and following it).
 */

// solution unique
const findCorrespondingNode = (rootA, rootB, target) => {
    const rootAWalker = document.createTreeWalker(
        rootA,
        NodeFilter.SHOW_ELEMENT
    );
    const rootBWalker = document.createTreeWalker(
        rootB,
        NodeFilter.SHOW_ELEMENT
    );
    let currentNodes = [rootAWalker.currentNode, rootBWalker.currentNode];
    while (currentNodes[0] !== target) {
        currentNodes = [rootAWalker.nextNode(), rootBWalker.nextNode()];
    }
    return currentNodes[1];
};

const findCorrespondingNodeUnique = (rootA, rootB, target) => {
    // if 'target' is itself rootA then directly return rootA, this will make 'path' array empty, and it will return rootB in reduceRight
    if (rootA === target) return rootB;
    // we can track 'target' in rootB using indexes stored during tracing 'target' in rootA
    let path = getRootAPath(rootA, target);
    // reduceRight is same as reduce but it iterate values from right to left
    // <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight>
    return path.reduceRight((accumulator, currentValue, index) => {
        return accumulator.children[currentValue];
    }, rootB); // rootB pointing to initialValue from where start the processing, this will be the accumulator when we start
};
// get path from target to rootA in the form of index arr, index pointing to position of a node in its parent HTML collection
function getRootAPath(rootA, target) {
    let path = [];
    let node = target;
    while (node !== rootA && node.parentNode) {
        // we will iterate till we reach top of the DOM tree
        const children = Array.from(node.parentNode.children); // convert HTMLCollection into Array
        path.push(children.indexOf(node)); // push index where 'node' found
        node = node.parentNode; // this will make sure we move from down to top
    }
    return path;
}
