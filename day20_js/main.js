const utils = require("../utils_js/utils");
const _ = require("lodash");

const key = (x, y) => x + "," + y;

function subPaths(rest) {
    let balance = 1;
    let i = 0;
    const paths = [];
    let curPath = "";
    while (balance > 0) {
        const next = rest[i];
        if (!next) throw new Error("EOS");
        if (next === "|" && balance === 1) {
            // only count branches on the top level
            paths.push(curPath);
            curPath = "";
        } else {
            if (next === "(") balance++;
            if (next === ")") balance--;
            if (balance > 0) curPath += next; // don't include the last closing )
        }
        i++
    }
    if (curPath) paths.push(curPath);
    const remainder = rest.substr(i);
    return paths.map((p) => p + remainder);
}

function walk(x, y, distance_walked, steps, map) {
    while (true) {
        const next = steps[0];
        const rest = steps.slice(1);
        steps = rest;
        const k = key(x, y);
        const best = map[k];
        if (best !== undefined) {
            if (best < distance_walked) {
                // ignore longer paths that lead here
                distance_walked = best;
            } else {
                map[k] = distance_walked;
            }
        } else {
            map[k] = distance_walked;
        }
        switch (next) {
            case "$":
                return map;
            case "(":
                // branch
                for (const path of subPaths(rest)) {
                    walk(x, y, distance_walked, path, map);
                }
                return map;
            case "W": x++; break;
            case "E": x--; break;
            case "N": y--; break;
            case "S": y++; break;
            default:
                throw new Error("Unhandled: " + next);
        }
        distance_walked++;    
    }
}

function buildFacility(regex) {
    return walk(0, 0, 0, regex.slice(1), {});
}

function part1(regex) {
    const f = buildFacility(regex);
    return _.max(_.values(f));
}

function part2(regex) {
    const f = buildFacility(regex);
    return _.values(f).filter((x) => x >= 1000).length;
}

module.exports = { part1, part2, subPaths };
