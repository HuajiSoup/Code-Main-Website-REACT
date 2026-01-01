function clamp(min, x, max) {
        return x < min ? min : x > max ? max : x;
}
function rand(a, b) {
    return a + (b - a)*Math.random();
}
function randint(a, b) {
    // => [a, b]
    return Math.floor(a + (b - a + 1)*Math.random());
}
function offsetEq(a, b, offset) {
    return Math.abs(a - b) < offset;
}

function deepCopy(obj) {
    if (Array.isArray(obj)) {
        let copy = new Array(obj.length);
        for (let i = 0; i < obj.length; i++) {
            copy[i] = deepCopy(obj[i]);
        }
        return copy;
    }
    if (typeof obj == "object") {
        let copy = Object.create(obj);
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                copy[key] = deepCopy(obj[key]);
            }
        }
        return copy;
    }
    return obj;
}
function removeFrom(array, ...elems) {
    for (const e of elems) {
        array.splice(array.indexOf(e), 1);
    }
}
function arrayEq(a, b) {
    let len;
    if ((len = a.length) != b.length) return false;
    for (let i = 0; i < len; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}
function deepEq(a, b) {
    if (Array.isArray(a) && Array.isArray(b)) {
        return arrayEq(a, b);
    } else if (typeof a == "object" && typeof b == "object") {
        let aKeys = Object.keys(a);
        let bKeys = Object.keys(b);
        if (aKeys.length != bKeys.length) return false;
        for (const key of aKeys) {
            if (!deepEq(a, b)) return false;
        }
        return true;
    } else {
        return a === b;
    }
}
function includesArray(dad, son) {
    for (let i = 0; i < dad.length; i++) {
        if (arrayEq(dad[i], son)) return true;
    }
    return false;
}
function arrayShuffle(array) {
    array.sort(() => (Math.random() - 0.5)); // Was it too resource-wasting??
}
function arrayFilled(length, elem) {
    // deep fill
    let res = new Array(length);
    for (let i = 0; i < length; i++) res[i] = deepCopy(elem);
    return res;
}
function randElem(arr) {
    return arr[randint(0, arr.length - 1)];
}
function randElems(arr_like, n) {
    // please make sure array.length >= n
    // Array.from as a FANCY & USEFUL way to copy!!!
    let cArr = Array.from(arr_like);
    let res = [];
    for (let _ = 0; _ < n; _++) {
        let i = randint(0, cArr.length - 1);
        res.push(cArr.splice(i, 1)[0]);
    }
    return res;
}

function dr(f) {
    f();
    return f;
}
function getRandFunc() {
    return (() => {        
        let rand = Math.random();
        for (let i = 0; i < arguments.length; i++) {
            if (rand < arguments[i][0]) {return arguments[i][1]();}
        }
    }).bind(this, arguments);
}
function blankOpen(url) {
        window.open(url, "_blank");
}

var ease = {
    // [0, 1] => [0, 1]
    quad: (x) => x * x,
    cubic: (x) => x * x * x,
    quadBack: (x) => 4 * x * (1-x),
}

export {clamp, rand, randint, arrayShuffle, arrayFilled, randElem, randElems, offsetEq, deepCopy, arrayEq, includesArray, removeFrom, dr, getRandFunc, blankOpen, ease};