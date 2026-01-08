/**
 * Your are given a 2-D array of characters. There is a hidden message in it.

I B C A L K A
D R F C A E A
G H O E L A D
The way to collect the message is as follows

start at top left
move diagonally down right
when cannot move any more, try to switch to diagonally up right
when cannot move any more, try switch to diagonally down right, repeat 3
stop when cannot neither move down right or up right. the character on the path is the message
for the input above, IROCLED should be returned.

notes

if no characters could be collected, return empty string
 */

function decode(msg) {
    if (!msg || !msg.length || !msg[0].length) {
        return "";
    }
    let str = "";
    let m = msg.length; // rows
    let n = msg[0].length; // cols

    let dir = 1;
    let i = 0,
        j = 0;

    while (true) {
        str += msg[i][j];
        let ni = i + dir;
        let nj = j + 1;
        if (ni >= 0 && ni < m && nj < n) {
            i = ni;
            j = nj;
        } else {
            dir *= -1;
            ni = i + dir;
            nj = j + 1;
            if (n >= 0 && ni < m && nj < n) {
                i = ni;
                j = nj;
            } else {
                break;
            }
        }
    }
    return str;
}

const arr = [
    ["I", "B", "C", "A", "L", "K", "A"],
    ["D", "R", "F", "C", "A", "E", "A"],
    ["G", "H", "O", "E", "L", "A", "D"],
];
console.log(decode(arr)); // IROCLED
