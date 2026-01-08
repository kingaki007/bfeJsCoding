// TODO: Do again
/**
 * There is Event Emitter in Node.js, Facebook once had its own implementation but now it is archived.

You are asked to create an Event Emitter Class

const emitter = new Emitter()
It should support event subscribing

const sub1  = emitter.subscribe('event1', callback1)
const sub2 = emitter.subscribe('event2', callback2)
// same callback could subscribe 
// on same event multiple times
const sub3 = emitter.subscribe('event1', callback1)
emit(eventName, ...args) is used to trigger the callbacks, with args relayed

emitter.emit('event1', 1, 2);
// callback1 will be called twice
Subscription returned by subscribe() has a release() method that could be used to unsubscribe

sub1.release()
sub3.release()
// now even if we emit 'event1' again, 
// callback1 is not called anymore

https://nodejs.org/api/events.html#events_class_eventemitter
http://github.com/facebookarchive/emitter
 */

// class EventEmitter {
//     constructor() {
//         this.eventsMap = new Map();
//     }

//     subscribe(eventName, cb) {
//         if (!this.eventsMap.has(eventName)) {
//             this.eventsMap.set(eventName, new Map());
//         }
//         const listeners = this.eventsMap.get(eventName);
//         const key = Symbol();
//         listeners.set(key, cb);

//         return {
//             release: () => listeners.delete(key),
//         };
//     }

//     emit(eventName, ...args) {
//         const subscriptions = this.eventsMap.get(eventName);
//         if (subscriptions) {
//             subscriptions.forEach((cb) => {
//                 cb?.apply(this, args);
//             });
//         } else {
//             console.log("no events found");
//         }
//     }
// }

class EventEmitter {
    constructor() {
        this.eventsMap = new Map();
    }

    subscribe(eventName, cb) {
        if (!this.eventsMap.has(eventName)) {
            this.eventsMap.set(eventName, new Set());
        }
        const subscription = this.eventsMap.get(eventName);
        const cbObj = { cb };
        subscription.add(cbObj);

        return { release: () => subscription.delete(cbObj) };
    }

    emit(eventName, ...args) {
        const subscriptions = this.eventsMap.get(eventName);
        if (subscriptions.size) {
            subscriptions.forEach((sub) => {
                sub?.cb?.apply(this, args);
            });
        } else {
            console.log("no events");
        }
    }
}

const callback1 = (...args) => console.log(`cb1 ${args}`);
const callback2 = (...args) => console.log(`cb2 ${args}`);

const emitter = new EventEmitter();
const sub1 = emitter.subscribe("event1", callback1);
const sub2 = emitter.subscribe("event2", callback2);
// same callback could subscribe
// on same event multiple times
const sub3 = emitter.subscribe("event1", callback1);

emitter.emit("event1", 1, 2);
sub1.release();
sub3.release();
emitter.emit("event1", 1, 2);
emitter.emit("event2", 1, 2);
