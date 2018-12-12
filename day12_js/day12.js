const utils = require("../utils_js/utils");
const Iterator = utils.Iterator;

function sumPotsWithPlants(stateMap, offset = 0) {
    const indexes = Object.keys(stateMap).map((k) => parseInt(k));
    return indexes.reduce((sum, i) => {
        const pot = stateMap[i];
        return sum + (pot === "#" ? (i + offset) : 0)
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
        if (rules.has(state)) newMap[i] = "#"; // sparse map
        return newMap;
    }, {})
}

function stateToString(stateMap) {
    const indexes = Object.keys(stateMap).map((k) => parseInt(k)).sort((a, b) => a - b);
    return indexes.map((i) => stateMap[i] || ".").join("");
}

function indexOfFirstPot(stateMap) {
    const indexes = Object.keys(stateMap).map((k) => parseInt(k)).sort((a, b) => a - b);
    return indexes.find((i) => stateMap[i] === "#");
}

function stateDesc(stateMap) {
    const indexes = Object.keys(stateMap).map((k) => parseInt(k)).sort((a, b) => a - b);
    const firstPot = indexes.find((i) => stateMap[i] === "#");
    const lastPot = indexes.reverse().find((i) => stateMap[i] === "#");
    const str = Array.from(utils.range(firstPot, lastPot + 1)).map((i) => stateMap[i] || ".").join("");
    return {firstPot, str};
}

function* generate(stateMap, rules) {
    seen = {};
    let iter = 0;
    while (true) {
        let {firstPot, str} = stateDesc(stateMap);
        if (seen[str] !== undefined) {
            const old = seen[str];
            // seen -194, -196
            // same pattern at minIdx that was previously at old
            const shifted = firstPot - old.firstPot; // negative left, positive right
            // pattern starts to repeat
            // 2 steps to the left
            throw {iter, shifted};
        }
        seen[str] = {iter, firstPot};
        stateMap = applyRules(stateMap, rules);
        iter++;
        yield stateMap;
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

function run(initialState, rules, iterations) {
    const states = generate(initialState, rules);
    let idx = 0;
    let state;
    for (state of states) {
        if (++idx === iterations) break;
    }
    return state;
}

function part1(lines, iterations = 20) {
    lines = lines.concat();
    const {rules, initialState} = parse(lines);
    try {
        const state = run(initialState, rules, iterations);
        return sumPotsWithPlants(state);
    } catch (e) {
        // At iteration iter, the pattern repeats by shifting
        // 'shifted' steps on each iteration.
        // Thus: run (iter-1) iterations
        const iterBeforeRepeat = e.iter - 1;
        const state = run(initialState, rules, iterBeforeRepeat);
        const iterLeft = iterations - iterBeforeRepeat;
        const totalShift = iterLeft * e.shifted;
        return sumPotsWithPlants(state, totalShift);
    }
}

function part2() {
}

module.exports = { part1, part2 };
