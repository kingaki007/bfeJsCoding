/**
 * This is a follow up on 6. implement basic debounce(), please refer to it for detailed explanation.

In this problem, you are asked to implement an enhanced debounce() which accepts third parameter, option: {leading: boolean, trailing: boolean}

leading: whether to invoke right away
trailing: whether to invoke after the delay.
6. implement basic debounce() is the default case with {leading: false, trailing: true}.

for the previous example of debouncing by 3 dashes

─ A ─ B ─ C ─ ─ D ─ ─ ─ ─ ─ ─ E ─ ─ F ─ G 
with {leading: false, trailing: true}, we get as below

─ ─ ─ ─ ─ ─ ─ ─ D ─ ─ ─ ─ ─ ─ ─ ─ ─ G
with {leading: true, trailing: true}:

─ A ─ ─ ─ ─ ─ ─ ─ D ─ ─ ─ E ─ ─ ─ ─ ─ ─ G
with {leading: true, trailing: false}

─ A ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ E
with {leading: false, trailing: false}, of course, nothing happens.

notes

please follow above spec. the behavior might not be exactly the same as lodash.debounce()

because window.setTimeout and window.clearTimeout are not accurate in browser environment, they are replaced to other implementation when judging your code. They still have the same interface, and internally keep track of the timing for testing purpose.

Something like below will be used to do the test.

let currentTime = 0
const run = (input) => {
  currentTime = 0
  const calls = []
  const func = (arg) => {
     calls.push(`${arg}@${currentTime}`)
  }
  const debounced = debounce(func, 3)
  input.forEach((call) => {
     const [arg, time] = call.split('@')
     setTimeout(() => debounced(arg), time)
  })
  return calls
}
expect(run(['A@0', 'B@2', 'C@3'])).toEqual(['C@6'])
 */

/**
 * Solution:
 * 
 * 
 * When debounced function is called, 
 * we basically want to delay the call after the delay and this behavior is controlled by options.trailing.

    options.leading makes things a bit tricky. 
    It means whether we should run the function immediately when not in cooldown. 
    If we run it immediately then we are not supposed run it after cooldown.

    So a timer could be set up always and when time is up, 
    we need to check if we should run the function. Now let's extend the logic from 6.
    implement basic debounce()
 */

function debounce(func, wait, option = { leading: false, trailing: true }) {
    let timer;
    return function (...args) {
        // clear the existing timer no matter what
        clearTimeout(timer);
        let isRun = false;
        if (timer == null && option.leading) {
            func.call(this, ...args);
            isRun = true;
        }
        timer = setTimeout(() => {
            if (option.trailing && !isRun) {
                func.call(this, ...args);
            }
            timer = null;
            isRun = false;
        }, wait);
    };
}
