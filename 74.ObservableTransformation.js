/**
 * This is a follow-up on 57. create an Observable.

There are a lot of operators for Observable, if we think of Observable as event stream, then modifying the stream is a common task, transformation operators are useful at this.

In this problem, you are asked to implement map(), as the name indicates, it maps the value to another value thus creating a new event stream.

Here is an example.

const source = Observable.from([1,2,3])
map(x => x * x)(source) // this transformer doubles numbers and create a new stream
 .subscribe(console.log)
// 1
// 4
// 9
Observable has pipe() method which could make this more readable.

const source = Observable.from([1,2,3])
source.pipe(map(x => x * x))
 .subscribe(console.log)
// 1
// 4
// 9
Note Observable is already given for you, no need to create it.
 */

/**
 * @param {any} input
 * @return {(observable: Observable) => Observable}
 * returns a function which trasnform Observable
 */
function map(transform) {
    // your code here
    return (observable) => {
        return new Observable((sub) => {
            observable.subscribe((val) => {
                sub.next(transform(val));
            });
        });
    };
}

function mapLong(transform) {
    return (source) => {
        return new Observable((subscriber) => {
            const sub = source.subscribe((val) => {
                try {
                    subscriber.next(transform(val));
                } catch (err) {
                    subscriber.error(err);
                    subscriber.complete();
                    sub.unsubscribe();
                }
            });
            this.unsubscribe = () => {
                sub.unsubscribe();
            };
        });
    };
}
