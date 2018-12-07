const fs = require("fs");

function readLines(path) {
    contents = fs.readFileSync(path, { encoding: "utf-8" });
    return contents.split(/\r?\n/);
}

function flatMap(array, fn) {
    return array.reduce((acc, elem) => acc.concat(fn(elem)), []);
}

function min(a, b) {
    return a < b ? a : b;
}

function max(a, b) {
    return a > b ? a : b;
}

function* zipInternal(a1, a2) {
    for (let i = 0, j = min(a1.length, a2.length); i < j; i++) {
        yield [a1[i], a2[i]];
    }
}

function zip(a1, a2) {
    return Array.from(zipInternal(a1, a2));
}

function* zipWithIndexInternal(arr) {
    for (let i = 0, j = arr.length; i < j; i++) {
        yield [arr[i], i];
    }
}

function zipWithIndex(arr) {
    return Array.from(zipWithIndexInternal(arr));
}

module.exports = {
    flatMap,
    max,
    min,
    readLines,
    zip,
    zipWithIndex
}