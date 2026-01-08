/**
 * 
 * This is a follow up on 4. implement basic throttle(), please refer to it for detailed explanation.

In this problem, you are asked to implement a enhanced throttle() which accepts third parameter, option: {leading: boolean, trailing: boolean}

leading: whether to invoke right away
trailing: whether to invoke after the delay.
4. implement basic throttle() is the default case with {leading: true, trailing: true}.

Explanation

for the previous example of throttling by 3 dashes

─ A ─ B ─ C ─ ─ D ─ ─ ─ ─ ─ ─ E ─ ─ F ─ G 
with {leading: true, trailing: true}, we get as below

─ A ─ ─ ─ C ─ ─ ─ D ─ ─ ─ ─ E ─ ─ ─ G 
with {leading: false, trailing: true}, A and E are swallowed.

─ ─ ─ ─ C ─ ─ ─ D ─ ─ ─ ─ ─ ─ ─ G 
with {leading: true, trailing: false}, only A D E are kept

─ A ─ ─ ─ ─ D ─ ─ ─ ─ ─ ─ E
with {leading: false, trailing: false}, of course, nothing happens.

notes

please follow above spec. the behavior is not exactly the same as lodash.throttle()

because window.setTimeout and window.clearTimeout are not accurate in browser environment, they are replaced to other implementation when judging your code. They still have the same interface, and internally keep track of the timing for testing purpose.

Something like below will be used to do the test.
 * 
 * 
 * 
 * 
 * 
 * We need to figure out the actual meaning of newly added options - leading and trailing, by looking closer at the description.

When leading is false and trailing is true, A, B, E and F are swallowed. B and F are in cooling while A and E are not. B and F has following calls so they are overwritten in stashing.
When leading and trailing are both true, only B and F are swallowed.
From above observation, we can derive that:

leading determines whether we should run the function immediately
trailing determines whether we should stash the call in cooling time
Now let's extend the logic from 4. implement basic throttle()

When throttled is called,

not in cooling time
leading is true → run it immediately
leading is false → ignore but still need to set up the timer
inside cooling time
trailing is true → stash to run after cooling ends
trailing is false → ignore
So here is a simple solution by tweaking the solution from 4. implement basic throttle()
 */

function throttle(func, wait, option = { leading: true, trailing: true }) {
    let timer = null;
    let stashedCall = null;
    function timeup() {
        timer = null;
        if (stashedCall) {
            func.call(...stashedCall);
            timer = setTimeout(timeup, wait);
            stashedCall = null;
        }
    }
    return function (...args) {
        if (timer == null) {
            if (option.leading) {
                func.call(this, ...args);
            }
            timer = setTimeout(timeup, wait);
        } else {
            if (option.trailing) {
                stashedCall = [this, args];
            }
        }
    };
}
