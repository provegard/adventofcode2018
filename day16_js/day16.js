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

function part1(lines) {
    const examples = Array.from(parse(lines));
    return examples.reduce((sum, ex) => {
        return sum + (behaves_like(ex) >= 3 ? 1 : 0);
    }, 0);
}

function part2() {

}

module.exports = { part1, part2, behaves_like, parse };
