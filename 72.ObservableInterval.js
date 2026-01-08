/**
 * This is a follow-up on 57. create an Observable.

Suppose you have solved 57. create an Observable, here you are asked to implement a creation operator interval().

From the document, interval()

Creates an Observable that emits sequential numbers every specified interval of time

interval(1000).subscribe(console.log);
Above code prints 0, 1, 2 .... with an interval of 1 seconds.

Note Observable is already given for you, no need to create it.
 */

/**
 * @param {number} period
 * @return {Observable}
 */
function interval(period) {
    return new Observable((subscriber) => {
        let counter = 0;
        let intervalId = setInterval(() => {
            subscriber.next(counter++);
        }, period);
    });
}

/**
 * @param {number} period
 * @return {Observable}
 */
function interval1(period) {
    return new Observable((sub) => {
        let i = 0;
        setInterval(() => {
            sub.next(i++);
        }, period);
    });
}

/**
 * @param {number} period
 * @return {Observable}
 */
function interval2(period) {
    return new Observable((subscriber) => {
        let count = 0;
        const timeoutID = setInterval(() => {
            subscriber.next(count++);
        }, period);
        return function () {
            clearInterval(timeoutID);
        };
    });
}
