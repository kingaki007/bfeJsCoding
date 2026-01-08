/**
 * @param {HTMLElement} tree
 * @return {string[]}
 */
function getTags(tree) {
    // your code here
    const treeWalker = document.createTreeWalker(
        tree,
        (NodeFilter.SHOW_ELEMENT = true)
    );
    ans = new Set();
    let cur = treeWalker.currentNode;
    while (cur) {
        ans.add(cur.tagName.toLowerCase());
        cur = treeWalker.nextNode();
    }
    return Array.from(ans);
}

const getTagsOne = (node, res = new Set()) => {
    res.add(node.tagName.toLowerCase());
    for (let n of node.children) {
        getTags(n, res);
    }
    return [...res];
};

function getTagsArrayFrom(tree) {
    return Array.from(
        new Set(
            [tree, ...tree.querySelectorAll("*")].map((ele) =>
                ele.nodeName.toLowerCase()
            )
        )
    );
}

/**
 * Given a DOM tree, please return all the tag names it has.

Your function should return a unique array of tags names in lowercase, order doesn't matter.
 */

// New implementation - Solution 1: Using TreeWalker correctly
function getTagsSolution1(tree) {
    const treeWalker = document.createTreeWalker(tree, NodeFilter.SHOW_ELEMENT);
    const tags = new Set();
    let currentNode = treeWalker.currentNode;

    while (currentNode) {
        tags.add(currentNode.tagName.toLowerCase());
        currentNode = treeWalker.nextNode();
    }

    return Array.from(tags);
}

// New implementation - Solution 2: Recursive approach
function getTagsSolution2(tree) {
    const tags = new Set();

    function traverse(node) {
        tags.add(node.tagName.toLowerCase());
        for (let child of node.children) {
            traverse(child);
        }
    }

    traverse(tree);
    return Array.from(tags);
}

// New implementation - Solution 3: Using querySelectorAll
function getTagsSolution3(tree) {
    const allElements = [tree, ...tree.querySelectorAll("*")];
    const tags = new Set();

    allElements.forEach((element) => {
        tags.add(element.tagName.toLowerCase());
    });

    return Array.from(tags);
}

// New implementation - Solution 4: Using getElementsByTagName approach
function getTagsSolution4(tree) {
    const tags = new Set();
    const allElements = tree.getElementsByTagName("*");

    for (let element of allElements) {
        tags.add(element.tagName.toLowerCase());
    }

    // Don't forget to include the root element itself
    tags.add(tree.tagName.toLowerCase());

    return Array.from(tags);
}
