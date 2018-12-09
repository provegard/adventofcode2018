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

const Iterator =
  {
    map: (f, it) => function* () {
        for (const x of it)
            yield f(x);
    }(),
    filter: (f, it) => function* () {
        for (const x of it)
            if (f(x)) yield x;
    }(),
    reject: (f, it) => function* () {
        for (const x of it)
            if (!f(x)) yield x;
    }(),
    flatMap: (f, it) => function* () {
        for (const x of it)
            for (const y of f(x))
                yield y;
    }(),
  };

function* range(x = 0, y = 1) {
    while (x < y)
        yield x++;
};

function measureAvgMs(fn, count = 100) {
    if (count < 10) throw new Error("Need at least 10 iterations");
    let totNs = 0;
    for (let i = 0; i < count; i++) {
        const start = process.hrtime();
        fn();
        const [s, ns] = process.hrtime(start);
        // Let the first three be warmup
        if (i > 2) {
            totNs += s * 1e9 + ns;
        }
    }
    return totNs / 1e6 / count;
}

module.exports = {
    flatMap,
    max,
    min,
    readLines,
    zip,
    zipWithIndex,
    range,
    Iterator,
    measureAvgMs
}