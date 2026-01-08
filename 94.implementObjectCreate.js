function myObjectCreate(proto) {
    if (typeof proto !== "object" || proto === null) {
        throw new Error("Object prototype may only be an Object");
    }

    function F() {}
    F.prototype = proto;
    return new F();
}

const Person = {
    name: "Ak",
};

const p = myObjectCreate(Person);
console.log(p);
console.log(p.name);
console.log(p.__proto__);
console.log(p.__proto__ == Person);
