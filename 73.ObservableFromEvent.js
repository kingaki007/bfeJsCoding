/**
 * This is a follow-up on 57. create an Observable.

Suppose you have solved 57. create an Observable, here you are asked to implement a creation operator fromEvent()( for DOM Event)

From the document, fromEvent()

Creates an Observable that emits events of a specific type coming from the given event target.

Simply speaking, it is a util to attach event listener in Observable fashion.

const source = fromEvent(node, 'click')
source.subscribe((e) => console.log(e))
When node is clicked, the event is logged.

Note

Observable is already given for you, no need to create it.
the event listener removal is handled by add(), which is beyond our scope here, you can ignore that.
 */

/**
 * @param {HTMLElement} element
 * @param {string} eventName
 * @param {boolean} capture
 * @return {Observable}
 */
function fromEvent(element, eventName, capture = false) {
    // your code here
    return new Observable((sub) => {
        const handler = (e) => sub.next(e);
        element.addEventListener(eventName, handler, capture);

        this.unsubscribe = () => {
            element.removeEventListener(eventName, handler, capture);
        };
    });
}

/**
 * @param {HTMLElement} element
 * @param {string} eventName
 * @param {boolean} capture
 * @return {Observable}
 */
function fromEvent1(element, eventName, capture = false) {
    return new Observable((sub) => {
        element.addEventListener(
            eventName,
            (event) => {
                sub.next(event);
            },
            capture
        );
    });
}

// With arrow function
function fromEventInline(element, eventName, capture = false) {
    return new Observable((sub) => {
        element.addEventListener(eventName, (e) => sub.next(e), capture);
    });
}
// With this binding
function fromEventWithBinding(element, eventName, capture = false) {
    return new Observable((sub) => {
        element.addEventListener(eventName, sub.next.bind(sub), capture);
    });
}

function fromEventReturn(element, eventName, capture = false) {
    return new Observable((subscriber) => {
        const listener = subscriber.next.bind(subscriber);
        element.addEventListener(eventName, listener, capture);
        return function () {
            element.addEventListener(eventName, listener);
        };
    });
}
