/**
 * You are given an unsorted array of numbers, which might have duplicates, find the K-th largest element.

The naive approach would be sort it first, but it costs O(nlogn), could you find a better approach?

Maybe you can recall what is happening in Quick Sort or Priority Queue
 */

/**
 * @param {number[]} arr
 * @param {number} k
 */
function findKThLargest(arr, k) {
    if (k <= 0 || k > arr.length) {
        return null;
    }

    // Convert to 0-based index (k-th largest = (n-k+1)-th smallest)
    const targetIndex = arr.length - k;

    return quickSelect([...arr], 0, arr.length - 1, targetIndex);
}

function quickSelect(arr, left, right, targetIndex) {
    if (left === right) {
        return arr[left];
    }

    // Choose a pivot and partition the array
    const pivotIndex = partition(arr, left, right);

    if (pivotIndex === targetIndex) {
        return arr[pivotIndex];
    } else if (pivotIndex < targetIndex) {
        // Target is in the right partition
        return quickSelect(arr, pivotIndex + 1, right, targetIndex);
    } else {
        // Target is in the left partition
        return quickSelect(arr, left, pivotIndex - 1, targetIndex);
    }
}

function partition(arr, left, right) {
    // Choose the rightmost element as pivot
    const pivot = arr[right];
    let i = left - 1;

    // Move all elements smaller than or equal to pivot to the left
    for (let j = left; j < right; j++) {
        if (arr[j] <= pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }

    // Move pivot to its correct position
    [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];

    return i + 1;
}

/**
 * Heap-based solution for finding K-th largest element
 * Time Complexity: O(n + k log n)
 * Space Complexity: O(n)
 *
 * @param {number[]} arr
 * @param {number} k
 * @returns {number|null}
 */
function findKThLargestHeap(arr, k) {
    if (k <= 0 || k > arr.length) {
        return null;
    }

    // Build max heap
    const heap = [...arr];
    buildMaxHeap(heap);

    // Extract k-1 largest elements
    for (let i = 0; i < k - 1; i++) {
        extractMax(heap);
    }

    // Return the k-th largest element (root of heap)
    return heap[0];
}

/**
 * Build max heap from array
 * @param {number[]} arr
 */
function buildMaxHeap(arr) {
    const n = arr.length;
    // Start from the last non-leaf node and heapify down
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapifyDown(arr, i, n);
    }
}

/**
 * Heapify down operation
 * @param {number[]} arr
 * @param {number} index
 * @param {number} heapSize
 */
function heapifyDown(arr, index, heapSize) {
    let largest = index;
    const left = 2 * index + 1;
    const right = 2 * index + 2;

    // Find the largest among node and its children
    if (left < heapSize && arr[left] > arr[largest]) {
        largest = left;
    }

    if (right < heapSize && arr[right] > arr[largest]) {
        largest = right;
    }

    // If largest is not the root, swap and continue heapifying
    if (largest !== index) {
        [arr[index], arr[largest]] = [arr[largest], arr[index]];
        heapifyDown(arr, largest, heapSize);
    }
}

/**
 * Extract maximum element from heap
 * @param {number[]} arr
 * @returns {number}
 */
function extractMax(arr) {
    const max = arr[0];
    arr[0] = arr[arr.length - 1];
    arr.pop();

    if (arr.length > 0) {
        heapifyDown(arr, 0, arr.length);
    }

    return max;
}

/**
 * Alternative heap solution using min heap (more efficient for large k)
 * Time Complexity: O(n log k)
 * Space Complexity: O(k)
 *
 * @param {number[]} arr
 * @param {number} k
 * @returns {number|null}
 */
function findKThLargestMinHeap(arr, k) {
    if (k <= 0 || k > arr.length) {
        return null;
    }

    // Use min heap to keep k largest elements
    const minHeap = [];

    for (const num of arr) {
        if (minHeap.length < k) {
            insertMinHeap(minHeap, num);
        } else if (num > minHeap[0]) {
            // Replace the smallest element in heap
            extractMin(minHeap);
            insertMinHeap(minHeap, num);
        }
    }

    return minHeap[0]; // Root is the k-th largest element
}

/**
 * Insert element into min heap
 * @param {number[]} heap
 * @param {number} value
 */
function insertMinHeap(heap, value) {
    heap.push(value);
    heapifyUp(heap, heap.length - 1);
}

/**
 * Extract minimum element from min heap
 * @param {number[]} heap
 * @returns {number}
 */
function extractMin(heap) {
    const min = heap[0];
    heap[0] = heap[heap.length - 1];
    heap.pop();

    if (heap.length > 0) {
        heapifyDownMin(heap, 0);
    }

    return min;
}

/**
 * Heapify up operation for min heap
 * @param {number[]} heap
 * @param {number} index
 */
function heapifyUp(heap, index) {
    const parent = Math.floor((index - 1) / 2);

    if (parent >= 0 && heap[index] < heap[parent]) {
        [heap[index], heap[parent]] = [heap[parent], heap[index]];
        heapifyUp(heap, parent);
    }
}

/**
 * Heapify down operation for min heap
 * @param {number[]} heap
 * @param {number} index
 */
function heapifyDownMin(heap, index) {
    let smallest = index;
    const left = 2 * index + 1;
    const right = 2 * index + 2;

    if (left < heap.length && heap[left] < heap[smallest]) {
        smallest = left;
    }

    if (right < heap.length && heap[right] < heap[smallest]) {
        smallest = right;
    }

    if (smallest !== index) {
        [heap[index], heap[smallest]] = [heap[smallest], heap[index]];
        heapifyDownMin(heap, smallest);
    }
}

// Test cases
// console.log(findKThLargest([3, 2, 1, 5, 6, 4], 2)); // 5
// console.log(findKThLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4)); // 4
// console.log(findKThLargest([1], 1)); // 1
// console.log(findKThLargest([1, 2, 3, 4, 5], 1)); // 5
// console.log(findKThLargest([1, 2, 3, 4, 5], 5)); // 1

// Test heap solutions
console.log(findKThLargestHeap([3, 2, 1, 5, 6, 4], 2)); // 5
console.log(findKThLargestMinHeap([3, 2, 1, 5, 6, 4], 2)); // 5
