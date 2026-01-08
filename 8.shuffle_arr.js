/**
 * How would you implement a shuffle() ?

When passed with an array, it should modify the array inline to generate a randomly picked permutation at the same probability.

for an array like this:

const arr = [1, 2, 3, 4]
there would be possibly 4! = 24 permutations

[1, 2, 3, 4]
[1, 2, 4, 3]
[1, 3, 2, 4]
[1, 3, 4, 2]
[1, 4, 2, 3]
[1, 4, 3, 2]
[2, 1, 3, 4]
[2, 1, 4, 3]
[2, 3, 1, 4]
[2, 3, 4, 1]
[2, 4, 1, 3]
[2, 4, 3, 1]
[3, 1, 2, 4]
[3, 1, 4, 2]
[3, 2, 1, 4]
[3, 2, 4, 1]
[3, 4, 1, 2]
[3, 4, 2, 1]
[4, 1, 2, 3]
[4, 1, 3, 2]
[4, 2, 1, 3]
[4, 2, 3, 1]
[4, 3, 1, 2]
[4, 3, 2, 1]
your shuffle() should transform the array in one of the above array, at the same 1/24 probability.

notes

Your shuffle() will be called multiple times, to calculate the probability on each possible result, and test again standard deviation

https://simple.wikipedia.org/wiki/Standard_deviation
ref: https://javascript.info/task/shuffle
 */

function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

let count = {
    123: 0,
    132: 0,
    213: 0,
    231: 0,
    321: 0,
    312: 0,
};

// for (let i = 0; i < 1000000; i++) {
//     let array = [1, 2, 3];
//     shuffle(array);
//     count[array.join("")]++;
// }

// show counts of all possible permutations
// for (let key in count) {
//     console.log(`${key}: ${count[key]}`);
// }

// Using the fisher-Yates shuffle
// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle

function shuffleYates(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

        // swap elements array[i] and array[j]
        // we use "destructuring assignment" syntax to achieve that
        // you'll find more details about that syntax in later chapters
        // same can be written as:
        // let t = array[i]; array[i] = array[j]; array[j] = t
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// function shuffleFisher(arr) {
//     for (let i = arr.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [arr[i], arr[j]] = [arr[j], arr[i]];
//     }
// }

function shuffleFisher(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

for (let i = 0; i < 1000000; i++) {
    let array = [1, 2, 3];
    shuffleFisher(array);
    count[array.join("")]++;
}

function shuffle(arr) {
    for (let i = 0; i < arr.length; i++) {
        const randomIndex = i + Math.floor(Math.random() * (arr.length - i));
        [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
    }
}

// show counts of all possible permutations
for (let key in count) {
    console.log(`${key}: ${count[key]}`);
}
