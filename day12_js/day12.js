
const utils = require("../utils_js/utils");
const Iterator = utils.Iterator;

class Rule {
    constructor(str) {
        // .#### => .
        const parts = str.split(" ");
        this.pattern = parts[0];
        this.result = parts[2];
    }

    apply(stateMap, idx) {
        const indexes = Array.from(utils.range(idx - 2, idx + 3)); // end is exclusive
        const state = indexes.map((i) => stateMap[i] || ".").join("");
        return state === this.pattern ? this.result : undefined;
    }
}

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

function applyRules(stateMap, rules) {
    const indexes = Object.keys(stateMap).map((k) => parseInt(k)); //.sort((a, b) => a - b);
    const minIdx = Math.min(...indexes);
    const maxIdx = Math.max(...indexes);
    const useThese = Array.from(utils.range(minIdx - 2, maxIdx + 3));
    //console.log(indexes);
    return useThese.reduce((newMap, i) => {
        const rule = rules.find((r) => r.apply(stateMap, i) !== undefined);
        if (rule) {
            //console.log(i + ": rule applies: " + rule.pattern + " -> " + rule.result);
            newMap[i] = rule.apply(stateMap, i); //TODO: remove ugly double apply
        } else {
            newMap[i] = "."; // implied?
            //throw new Error("no rule applied");
        }
        return newMap;
    }, {})
}

function stateToString(stateMap) {
    const indexes = Object.keys(stateMap).map((k) => parseInt(k)).sort((a, b) => a - b);
    return indexes.map((i) => stateMap[i] || ".").join("");
}

function run(stateMap, rules, iterations) {
    //console.log(stateToString(stateMap));
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
    const rules = lines.map((r) => new Rule(r));
    return {rules, initialState};
}

function part1(lines) {
    const {rules, initialState} = parse(lines);
    const state = run(initialState, rules, 20);
    //console.log(stateToString(state));
    return sumPotsWithPlants(state);
}

function part2() {
}

module.exports = { part1, part2 };
