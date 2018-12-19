const utils = require("../utils_js/utils");
const _ = require("lodash");

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

function parseLine(line) {

}

function buildProgram(lines)  {
    lines = lines.concat();
    const ipDef = lines.shift();
    let parts = ipDef.split(" ");
    const ipReg = +parts[1];
    const instructions = lines.map((line) => {
        parts = line.split(" ");
        const opfn = Operations[parts[0]];
        const args = parts.slice(1).map((p) => +p);
        return (regs) => opfn.apply(null, [regs].concat(args));
    });
    return { ipReg, instructions };
}

function part1(lines) {
    const { ipReg, instructions } = buildProgram(lines);
    let curIp = 0;
    let regs = [0, 0, 0, 0, 0, 0]
    while (curIp >= 0 && curIp < instructions.length) {
        regs[ipReg] = curIp;
        regs = instructions[curIp](regs);
        curIp = 1 + regs[ipReg];
    }
    return regs[0];
}

function part2(lines) {
}

module.exports = { part1, part2 };
