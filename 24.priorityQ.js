// TODO: prepare DSA
/**
 * 
 * Priority Queue is a commonly used data structure in algorithm problem. Especially useful for Top K problem with a huge amount of input data, since it could avoid sorting the whole but keep a fixed-length sorted portion of it.

Since there is no built-in Priority Queue in JavaScript, in a real interview, you should tell interview saying that "Suppose we already have a Priority Queue Class I can use", there is no time for you to write a Priority Queue from scratch.

But it is a good coding problem to practice, so please implement a Priority Queue with following interface

class PriorityQueue {
  // compare is a function defines the priority, which is the order
  // the elements closer to first element is sooner to be removed.
  constructor(compare) {
  
  }
  
  // add a new element to the queue
  // you need to put it in the right order
  add(element) {
  }
  // remove the head element and return
  poll() {
  
  }
  // get the head element
  peek() {
  }
  // get the amount of items in the queue
  size() {
  }
}
Here is an example to make it clearer

const pq = new PriorityQueue((a, b) => a - b)
// (a, b) => a - b means
// smaller numbers are closer to index:0
// which means smaller number are to be removed sooner
pq.add(5)
// now 5 is the only element
pq.add(2)
// 2 added
pq.add(1)
// 1 added
pq.peek()
// since smaller number are sooner to be removed
// so this gives us 1
pq.poll()
// 1 
// 1 is removed, 2 and 5 are left
pq.peek()
// 2 is the smallest now, this returns 2
pq.poll()
// 2 
// 2 is removed, only 5 is left
 * 
 * https://storm.cis.fordham.edu/~yli/documents/CISC2200Spring15/Graph.pdf
 */

class PriorityQueue {
    constructor(compare) {
        this.compare = compare;
        this.heap = [];
    }

    add(element) {
        this.heap.push(element);
        this._heapifyUp();
    }

    poll() {
        if (this.size() === 0) return undefined;
        const top = this.heap[0];
        const last = this.heap.pop();
        if (this.size() > 0) {
            this.heap[0] = last;
            this._heapifyDown();
        }
        return top;
    }

    peek() {
        return this.heap[0];
    }

    size() {
        return this.heap.length;
    }

    _heapifyUp() {
        let idx = this.heap.length - 1;
        while (idx > 0) {
            let parentIdx = Math.floor((idx - 1) / 2);
            if (this.compare(this.heap[idx], this.heap[parentIdx]) < 0) {
                [this.heap[idx], this.heap[parentIdx]] = [
                    this.heap[parentIdx],
                    this.heap[idx],
                ];
                idx = parentIdx;
            } else {
                break;
            }
        }
    }

    _heapifyDown() {
        let idx = 0;
        const length = this.heap.length;
        while (true) {
            let left = 2 * idx + 1;
            let right = 2 * idx + 2;
            let smallest = idx;

            if (
                left < length &&
                this.compare(this.heap[left], this.heap[smallest]) < 0
            ) {
                smallest = left;
            }
            if (
                right < length &&
                this.compare(this.heap[right], this.heap[smallest]) < 0
            ) {
                smallest = right;
            }
            if (smallest !== idx) {
                [this.heap[idx], this.heap[smallest]] = [
                    this.heap[smallest],
                    this.heap[idx],
                ];
                idx = smallest;
            } else {
                break;
            }
        }
    }
}

// Example usage:
const pq = new PriorityQueue((a, b) => a - b);
pq.add(5);
pq.add(2);
pq.add(1);
console.log(pq.peek()); // 1
console.log(pq.poll()); // 1
console.log(pq.peek()); // 2
console.log(pq.poll()); // 2
console.log(pq.peek()); // 5
