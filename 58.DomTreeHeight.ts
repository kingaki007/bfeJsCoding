/**
 * Height of a tree is the maximum depth from root node.
 * Empty root node have a height of 0.
 *
 * Problem: Given a DOM tree, create a function to get its height.
 *
 * Example:
 * For the DOM tree below, height is 4
 * <div>
 *   <div>
 *     <p>
 *       <button>Hello</button>
 *     </p>
 *   </div>
 *   <p>
 *     <span>World!</span>
 *   </p>
 * </div>
 *
 * Task: Solve this both recursively and iteratively.
 */

// Solution 1: Recursive approach
function getHeightRecursive(tree: Element | null): number {
    if (!tree) return 0;

    // Get all child elements
    const children = Array.from(tree.children);

    if (children.length === 0) return 1;

    // Recursively get height of each subtree and take the maximum
    return 1 + Math.max(...children.map((child) => getHeightRecursive(child)));
}

// Solution 2: Iterative approach using BFS with level tracking
function getHeightIterative(tree: Element | null): number {
    if (!tree) return 0;

    let height = 0;
    const queue: [Element, number][] = [[tree, 1]];

    while (queue.length > 0) {
        const [node, level] = queue.shift()!;
        height = Math.max(height, level);

        // Add all children to queue with incremented level
        const children = Array.from(node.children);
        children.forEach((child) => {
            queue.push([child, level + 1]);
        });
    }

    return height;
}

// Solution 3: Iterative approach using DFS with stack
function getHeightDFS(tree: Element | null): number {
    if (!tree) return 0;

    let maxHeight = 1;
    const stack: [Element, number][] = [[tree, 1]];

    while (stack.length > 0) {
        const [node, depth] = stack.pop()!;
        maxHeight = Math.max(maxHeight, depth);

        // Add all children to stack with incremented depth
        const children = Array.from(node.children);
        children.forEach((child) => {
            stack.push([child, depth + 1]);
        });
    }

    return maxHeight;
}

// Export all solutions
export {
    getHeightRecursive as getHeight, // Main solution
    getHeightIterative,
    getHeightDFS,
};

const div = document.createElement("div");
div.innerHTML = `
<div>
  <p>
    <button>Hello</button>
  </p>
</div>
<p>
  <span>World!</span>
</p>`;
// expect(getHeight(div)).toBe(4);
// expect(getHeight(document.createElement('p'))).toBe(1)

console.log(getHeightDFS(div));
