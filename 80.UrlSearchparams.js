/**
 * When we want to extract parameters from query string, URLSearchParams could be very handy.

Can you implement MyURLSearchParams which works the same ?

const params = new MyURLSearchParams('?a=1&a=2&b=2')
params.get('a') // '1'
params.getAll('a') // ['1', '2']
params.get('b') // '2'
params.getAll('b') // ['2']
params.append('a', 3)
params.set('b', '3')
params.toString() // 'a=1&a=2&b=3&a=3'
There are a few methods on URLSearchParams, please implement them all.
 */

class MyURLSearchParams {
    /**
     * @params {string} init
     */
    constructor(init) {
        this.params = init
            .replace(/^\?/, "")
            .split("&")
            .map((param) => param.split("="));
    }
    /**
     * @params {string} name
     * @params {any} value
     */
    append(name, value) {
        this.params.push([name, String(value)]);
    }
    /**
     * @params {string} name
     */
    delete(name) {
        this.params = this.params.filter((param) => param[0] !== name);
    }
    /**
     * @returns {Iterator}
     */
    *entries() {
        for (let i = 0; i < this.params.length; i++) {
            yield [this.params[i][0], this.params[i][1]];
        }
    }
    /**
     * @param {(value, key) => void} callback
     */
    forEach(callback) {
        this.params.forEach((param) => {
            callback.apply(this, [param[1], param[0]]);
        });
    }
    /**
     * @param {string} name
     * returns the first value of the name
     */
    get(name) {
        return this.params.find((param) => param[0] === name)?.[1] || null;
    }
    /**
     * @param {string} name
     * @return {string[]}
     * returns the value list of the name
     */
    getAll(name) {
        return this.params
            .filter((param) => param[0] === name)
            .map((param) => param[1]);
    }
    /**
     * @params {string} name
     * @return {boolean}
     */
    has(name) {
        return this.params.some((param) => param[0] === name);
    }
    /**
     * @return {Iterator}
     */
    keys() {
        return this.params.map((param) => param[0]);
    }
    /**
     * @param {string} name
     * @param {any} value
     */
    set(name, value) {
        const exists = this.params.some((param) => {
            if (param[0] !== name) return false;
            param[1] = String(value);
            return true;
        });
        if (!exists) {
            this.append(name, value);
        }
    }
    // sort all key/value pairs based on the keys
    sort() {
        this.params.sort((a, b) => {
            if (a[0] > b[0]) return 1;
            if (a[0] < b[0]) return -1;
            return 0;
        });
    }
    /**
     * @return {string}
     */
    toString() {
        return this.params.map((param) => param.join("=")).join("&");
    }
    /**
     * @return {Iterator} values
     */
    values() {
        return this.params.map((param) => param[1]);
    }

    // values() {
    //     return [...this.paramMap].flatMap(([key, values]) => values)
    //     // or
    //     // for(const [key, values] of this.paramMap) {
    //     //   for(const value of values) {
    //     //     yield value;
    //     //   }
    //     // }
    //  }
}

class MyURLSearchParams1 {
    constructor(init) {
        this.qs = init[0] === "?" ? init.slice(1) : init;
        this.qsMap = {};
        this.qs.split("&").forEach((param) => {
            const [key, value] = param.split("=");
            if (!(key in this.qsMap)) {
                this.qsMap[key] = [];
            }
            this.qsMap[key].push(value);
        });
    }
    append(name, value) {
        this.qs += `&${name}=${value + ""}`;
        if (name in this.qsMap) {
            this.qsMap[name].push(value + "");
        } else {
            this.qsMap[name] = value + "";
        }
    }
    delete(name) {
        delete this.qsMap[name];
        this.qs = this.qs
            .split("&")
            .filter((i) => i.split("=")[0] !== "a")
            .join("&");
    }
    *entries() {
        const args = this.qs.split("&");
        for (let arg of args) {
            const [key, value] = arg.split("=");
            let reply = [key, value];
            yield reply;
        }
    }
    forEach(callback) {
        [...this.entries()].forEach((i) => {
            callback(i[1], i[0]);
        });
    }
    get(name) {
        return name in this.qsMap ? this.qsMap[name][0] : null;
    }
    getAll(name) {
        return name in this.qsMap ? this.qsMap[name] : [];
    }
    has(name) {
        return name in this.qsMap;
    }
    keys() {
        return this.qs.split("&").map((keyValue) => keyValue.split("=")[0]);
    }
    set(name, value) {
        this.qsMap[name] = [value + ""];
        this.append(name, value);
    }
    sort() {
        const sortedQs = [];
        const sortedKeys = Object.keys(this.qsMap).sort();
        sortedKeys.forEach((key) => {
            const values = this.qsMap[key];
            values.forEach((value) => sortedQs.push(`${key}=${value}`));
        });
        this.qs = sortedQs.join("&");
    }
    toString() {
        return this.qs;
    }
    values() {
        return this.qs.split("&").map((keyValue) => keyValue.split("=")[1]);
    }
}
