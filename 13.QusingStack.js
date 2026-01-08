class Stack {
    stack = [];
    push(element) {
        /* add element to stack */
        this.stack.push(element);
    }
    peek() {
        /* get the top element */
        this.s;
    }
    pop() {
        /* remove the top element */
    }
    size() {
        /* count of elements */
    }
}

class Queue {
    s1 = [];
    s2 = [];

    enqueue(element) {
        /* add element to queue, similar to Array.prototype.push */
        this.s1.push(element);
    }
    peek() {
        /* get the head element*/
        if (!this.s1.length) return undefined;
        // Move all elements to s2 to access the oldest (front) element
        while (this.s1.length) {
            this.s2.push(this.s1.pop());
        }
        const front = this.s2[this.s2.length - 1];
        // Move them back to s1
        while (this.s2.length) {
            this.s1.push(this.s2.pop());
        }
        return front;
    }
    dequeue() {
        /* remove the head element, similar to Array.prototype.pop */
        while (this.s1.length) {
            this.s2.push(this.s1.pop());
        }
        const popped = this.s2.pop();

        while (this.s2.length) {
            this.s1.push(this.s2.pop());
        }
        return popped;
    }
    size() {
        /* count of elements */
        return this.s1.length;
    }
}

const q = new Queue();
q.enqueue(1);
q.enqueue(2);
q.enqueue(3);
q.enqueue(4);
console.log(q.size());
console.log(q.dequeue());
console.log(q.dequeue());
console.log(q.dequeue());
console.log(q.size());
