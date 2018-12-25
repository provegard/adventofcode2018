const utils = require("../utils_js/utils");
const _ = require("lodash");

class Point4D {
    constructor(x, y, z, t) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.t = t;
    }

    manhattan(other) {
        return Math.abs(this.x - other.x) +
            Math.abs(this.y - other.y) +
            Math.abs(this.z - other.z) +
            Math.abs(this.t - other.t);
    }
}

function lineToPoint(line) {
    const parts = line.split(",");
    const [x, y, z, t] = parts.map((p) => +p.trim());
    return new Point4D(x, y, z, t);
}

function parseLines(lines) {
    return lines.map(lineToPoint);
}

function findConstellation(points, candidates) {
    if (points.length === 0) {
        return {found: points, rest: candidates};
    }

    const result = _.groupBy(candidates, (c) => points.some((p) => p.manhattan(c) <= 3));
    const found = result[true] || [];
    const rest = result[false] || [];

    const rec = findConstellation(found, rest);
    const ff = points.concat(rec.found);
    const rr = rec.rest;
    return {found: ff, rest: rr};
}

function *constellations(points) {
    let copy = points.concat();
    while (copy.length > 0) {
        const p = copy.shift();
        const {found, rest} = findConstellation([p], copy);
        copy = rest;
        yield found;
    }
}

function constellationCount(lines) {
    const points = parseLines(lines);
    return Array.from(constellations(points)).length;
}

function cc(file) {
    const lines = utils.readLines(file);
    return constellationCount(lines);
}

console.log(cc("example1"), "should be", 2);
console.log(cc("example2"), "should be", 4);
console.log(cc("example3"), "should be", 3);
console.log(cc("example4"), "should be", 8);
console.log(cc("input"), "should be", 318);
