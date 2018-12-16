const utils = require("../utils_js/utils");
const Iterator = utils.Iterator;

function update_regs(regs, idx, value) {
    const new_regs = regs.concat();
    new_regs[idx] = value;
    return new_regs;
}

const Operations = {
    addr: (regs, a, b, c) => update_regs(regs, c, regs[a] + regs[b]),
    addi: (regs, a, b, c) => update_regs(regs, c, regs[a] + b),

    mulr: (regs, a, b, c) => update_regs(regs, c, regs[a] * regs[b]),
    muli: (regs, a, b, c) => update_regs(regs, c, regs[a] * b),

    banr: (regs, a, b, c) => update_regs(regs, c, regs[a] & regs[b]),
    bani: (regs, a, b, c) => update_regs(regs, c, regs[a] & b),

    borr: (regs, a, b, c) => update_regs(regs, c, regs[a] | regs[b]),
    bori: (regs, a, b, c) => update_regs(regs, c, regs[a] | b),

    setr: (regs, a, b, c) => update_regs(regs, c, regs[a]),
    seti: (regs, a, b, c) => update_regs(regs, c, a),

    gtir: (regs, a, b, c) => update_regs(regs, c, a > regs[b] ? 1 : 0),
    gtri: (regs, a, b, c) => update_regs(regs, c, regs[a] > b ? 1 : 0),
    gtrr: (regs, a, b, c) => update_regs(regs, c, regs[a] > regs[b] ? 1 : 0),

    eqir: (regs, a, b, c) => update_regs(regs, c, a === regs[b] ? 1 : 0),
    eqri: (regs, a, b, c) => update_regs(regs, c, regs[a] === b ? 1 : 0),
    eqrr: (regs, a, b, c) => update_regs(regs, c, regs[a] === regs[b] ? 1 : 0),
}
const OpFunctions = Object.keys(Operations).map((k) => Operations[k]);

function eq_arrays(a, b) {
    if (a.length !== b.length) return false;
    return a.every((x, idx) => x === b[idx]);
}

function behaves_like(example) {
    return OpFunctions.reduce((acc, fn) => {
        const regs_before = example.before.concat();
        const args = example.instruction.slice(1);
        const outcome = fn.apply(null, [regs_before].concat(args));
        return eq_arrays(outcome, example.after)
            ? acc + 1
            : acc;
    }, 0);
}

function functions_that_fit(example) {
    return Object.keys(Operations).filter((name) => {
        const fn = Operations[name];
        const regs_before = example.before.concat();
        const args = example.instruction.slice(1);
        const outcome = fn.apply(null, [regs_before].concat(args));
        return eq_arrays(outcome, example.after);
    });
}

function* parse(lines) {
    let before, instruction, after;
    for (const line of lines) {
        if (line.indexOf("Before:") === 0) {
            before = JSON.parse(line.substr(8));
        } else if (line.indexOf("After:") === 0) {
            after = JSON.parse(line.substr(7));
            yield { before, after, instruction };
            before = null;
            after = null;
        } else if (before) {
            if (!line) throw new Error("Unexpected empty line");
            instruction = line.split(" ").map((s) => +s);
        }
    }
}

const set_intersection = (a, b) => new Set([...a].filter(x => b.has(x)));
const all_ready = (possibilities_by_opcode) => Object.keys(possibilities_by_opcode).every((k) => possibilities_by_opcode[k].size === 1);
const ready_opcodes = (possibilities_by_opcode) =>
    Object.keys(possibilities_by_opcode)
        .filter((k) => possibilities_by_opcode[k].size === 1)
        .map((k) => [k, [...possibilities_by_opcode[k]][0]]);

function identify_opcodes(lines) {
    const examples = Array.from(parse(lines));
    const examples_by_opcode = examples.reduce((acc, ex) => {
        const opcode = ex.instruction[0];
        const list = acc[opcode] || (acc[opcode] = []);
        list.push(ex);
        return acc;
    }, {});
    const possibilities_by_opcode = Object.keys(examples_by_opcode).reduce((acc, k) => {
        const examples_for_opcode = examples_by_opcode[k];
        const sets = examples_for_opcode.map((ex) => new Set(functions_that_fit(ex)));
        const first = sets.shift();
        const possibilities = sets.reduce(set_intersection, first);
        //if (possibilities.size !== 1) throw new Error("failed to find a single possibility");
        acc[k] = possibilities;
        return acc;
    }, {});
    while (!all_ready(possibilities_by_opcode)) {
        for (const [opcode, name] of ready_opcodes(possibilities_by_opcode)) {
            for (const oc of Object.keys(possibilities_by_opcode)) {
                if (oc === opcode) continue;
                possibilities_by_opcode[oc].delete(name);
            }
        }
    }
    return Object.keys(possibilities_by_opcode).reduce((acc, k) => {
        acc[k] = [...possibilities_by_opcode[k]][0];
        return acc;
    }, {});
}

function part1(lines) {
    const examples = Array.from(parse(lines));
    return examples.reduce((sum, ex) => {
        return sum + (behaves_like(ex) >= 3 ? 1 : 0);
    }, 0);
}

function part2(lines, program) {
    const opcode_map = identify_opcodes(lines);
    let registers = [0, 0, 0, 0];
    for (const instruction of program) {
        const numeric = instruction.split(" ").map((s) => +s);
        const opcode = numeric.shift();
        const op = opcode_map[opcode];
        const fn = Operations[op];
        registers = fn.apply(null, [registers].concat(numeric));
    }
    return registers[0];
}

module.exports = { part1, part2, behaves_like, parse, functions_that_fit };
