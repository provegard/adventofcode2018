const utils = require("../utils_js/utils");
const Iterator = utils.Iterator;

function sumPotsWithPlants(stateMap) {
    const indexes = Object.keys(stateMap).map((k) => parseInt(k));
    return indexes.reduce((sum, i) => {
        const pot = stateMap[i];
        return sum + (pot === "#" ? i : 0)
    }, 0);
}

function stateMap(state) {
    return utils.zipWithIndex(state).reduce((map, [pot, idx]) => {
        map[idx] = pot;
        return map;
    }, {});
}

function stateAt(stateMap, idx) {
    const indexes = Array.from(utils.range(idx - 2, idx + 3)); // end is exclusive
    return indexes.map((i) => stateMap[i] || ".").join("");
}

function applyRules(stateMap, rules) {
    const indexes = Object.keys(stateMap).map((k) => parseInt(k)); //.sort((a, b) => a - b);
    const minIdx = Math.min(...indexes);
    const maxIdx = Math.max(...indexes);
    const useThese = Array.from(utils.range(minIdx - 2, maxIdx + 3));
    return useThese.reduce((newMap, i) => {
        const state = stateAt(stateMap, i);
        newMap[i] = rules.has(state) ? "#" : ".";
        return newMap;
    }, {})
}

function stateToString(stateMap) {
    const indexes = Object.keys(stateMap).map((k) => parseInt(k)).sort((a, b) => a - b);
    return indexes.map((i) => stateMap[i] || ".").join("");
}

function run(stateMap, rules, iterations) {
    if (iterations > 0) {
        return run(applyRules(stateMap, rules), rules, iterations - 1);
    } else {
        return stateMap;
    }
}

function parse(lines) {
    const stateLine = lines.shift();
    const colon = stateLine.indexOf(":");
    const initialState = stateMap(stateLine.substr(colon + 2));

    // skip empty
    lines.shift();
    const rules = lines.reduce((ruleSet, r) => {
        const parts = r.split(" ");
        if (parts[2] === "#") ruleSet.add(parts[0])
        return ruleSet;
    }, new Set());
    return {rules, initialState};
}

function part1(lines, iterations = 20) {
    const {rules, initialState} = parse(lines);
    const state = run(initialState, rules, iterations);
    return sumPotsWithPlants(state);
}

function part2() {
}

module.exports = { part1, part2 };
