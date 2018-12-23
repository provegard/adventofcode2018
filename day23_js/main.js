const utils = require("../utils_js/utils");
const _ = require("lodash");

class NanoBot {
    constructor(x, y, z, r) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.r = r;
    }

    manhattan(bot) {
        return Math.abs(this.x - bot.x) + Math.abs(this.y - bot.y) + Math.abs(this.z - bot.z);
    }
}
NanoBot.parse = (line) => {
    // pos=<0,0,0>, r=4
    const parts = line.split(/[<>,=]/)
    // [ 'pos', '', '0', '0', '0', '', ' r', '4' ]
    const x = +parts[2];
    const y = +parts[3];
    const z = +parts[4];
    const r = +parts[7];
    return new NanoBot(x, y, z, r);
}

function part1(lines) {
    const bots = lines.map(NanoBot.parse);
    const maxBot = _.maxBy(bots, (b) => b.r);
    const inRange = bots.filter((b) => maxBot.manhattan(b) <= maxBot.r);
    return inRange.length;
}

function part2(lines) {
}

module.exports = { part1, part2 };
