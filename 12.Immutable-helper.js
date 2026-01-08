/**
 * 
 * If you use React, you would meet the scenario to copy the state for a slight change.

For example, for following state

const state = {
  a: {
    b: {
      c: 1
    }
  },
  d: 2
}
if we are to modify d to a new state, we could use _.cloneDeep, but it is not efficient because state.a is cloned while we don't need to change that.

A better way is to do shallow copy like this

const newState = {
  ...state,
  d: 3
}
now is the problem, if we want to modify c, we would have to do something like

const newState = {
  ...state,
  a: {
    ...state.a,
    b: {
       ...state.b,
       c: 2
    }
  }
}
We can see that for simple data structure it would be enough to use spread operator, but for complex data structures, it is verbose.

Here comes the Immutability Helper, you are asked to implement your own Immutability Helper update(), which supports following features.

1. {$push: array} push() all the items in array on the target.
const arr = [1, 2, 3, 4]
const newArr = update(arr, {$push: [5, 6]})
2. {$set: any} replace the target
const state = {
  a: {
    b: {
      c: 1
    }
  },
  d: 2
}
const newState = update(
  state, 
  {a: {b: { c: {$set: 3}}}}
)

{
  a: {
    b: {
      c: 3
    }
  },
  d: 2
}

Notice that we could also update array elements with $set

const arr = [1, 2, 3, 4]
const newArr = update(
  arr, 
  {0: {$set: 0}}
)
3. {$merge: object} merge object to the location
const state = {
  a: {
    b: {
      c: 1
    }
  },
  d: 2
}
const newState = update(
  state, 
  {a: {b: { $merge: {e: 5}}}}
)

{
  a: {
    b: {
      c: 1,
      e: 5
    }
  },
  d: 2
}

4. {$apply: function} custom replacer
const arr = [1, 2, 3, 4]
const newArr = update(arr, {0: {$apply: (item) => item * 2}})
 */

// const update = (data, command) => {
//     // Command keys
//     const COMMANDS = ["$push", "$set", "$merge", "$apply"];
//     // If command is a command object
//     if (typeof command === "object" && command !== null) {
//         // $set
//         if ("$set" in command) {
//             return command["$set"];
//         }
//         // $push
//         if ("$push" in command) {
//             if (!Array.isArray(data))
//                 throw new Error("$push target must be array");
//             return data.concat(command["$push"]);
//         }
//         // $merge
//         if ("$merge" in command) {
//             if (typeof data !== "object" || data === null)
//                 throw new Error("$merge target must be object");
//             return { ...data, ...command["$merge"] };
//         }
//         // $apply
//         if ("$apply" in command) {
//             return command["$apply"](data);
//         }
//         // Otherwise, recursively update
//         let copy = Array.isArray(data) ? data.slice() : { ...data };
//         for (let key in command) {
//             if (command.hasOwnProperty(key)) {
//                 copy[key] = update(data[key], command[key]);
//             }
//         }
//         return copy;
//     }
//     // If command is not an object, return data as is
//     return data;
// };

// const update = (data, command) => {
//     for (const [key, value] of Object.entries(command)) {
//         switch (key) {
//             case "$push":
//                 return [...data, ...value];
//             case "$set":
//                 return value;
//             case "$apply":
//                 return value(data);
//             case "$merge":
//                 if (!(data instanceof Object) || data === null) {
//                     throw new Error("Bad merge");
//                 }
//                 return { ...data, ...value };
//             default:
//                 if (Array.isArray(data)) {
//                     let res = [...data];
//                     res[key] = update(data[key], value);
//                     return res;
//                 } else {
//                     return {
//                         ...data,
//                         [key]: update(data[key], value),
//                     };
//                 }
//         }
//     }
// };

const update = (data, command) => {
    for (const [key, value] of Object.entries(command)) {
        switch (key) {
            case "$push":
                return [...data, ...value];
            case "$set":
                return value;
            case "$merge":
                if (!(data instanceof Object)) {
                    throw Error("Bad merge");
                }
                return { ...data, ...value };
            case "$apply":
                return value(data);
            default:
                if (Array.isArray(data)) {
                    const result = [...data];
                    result[key] = update(data[key], value);
                    return result;
                } else {
                    return {
                        ...data,
                        [key]: update(data[key], value),
                    };
                }
        }
    }
};

/**
 * 
update([1], {$push: [2, 3]})  
update({a: [1]}, {a: {$push: [2, 3]}})  
$push on non-array should throw error  
update([1], {1: {$set: 2}})  
update({a: {b: 1}}, {a: { b: {$set: 2}}})  
update({a: {b: 1}}, {a: {$merge: {c: 3}}})  
update({a: {c: 1}}, {a: {$merge: {c: 3}}})  
 */

const arr = [1, 2, 3, 4];
const newArr1 = update(arr, { 0: { $apply: (item) => item * 2 } });
const newArr2 = update([1], { $push: [2, 3] });
const newArr3 = update({ a: [1] }, { a: { $push: [2, 3] } });
const newArr4 = update([1], { 1: { $set: 2 } });
const newArr5 = update({ a: { b: 1 } }, { a: { b: { $set: 2 } } });
const newArr6 = update({ a: { b: 1 } }, { a: { $merge: { c: 3 } } });
const newArr7 = update({ a: { c: 1 } }, { a: { $merge: { c: 3 } } });
console.log({ newArr1, newArr2, newArr3, newArr4, newArr5, newArr6, newArr7 });
