export class ListNode {
    val: number;
    next: ListNode | null;

    constructor(val: number, next: ListNode | null = null) {
        this.val = val;
        this.next = next;
    }
}

const reverseList = (head: ListNode | null): ListNode | null => {
    if (!head || !head.next) {
        return head;
    }

    const newHead = reverseList(head.next);

    head.next.next = head;

    head.next = null;

    return newHead;
};
