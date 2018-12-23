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

    inRange(pos) {
        return this.manhattan(pos) <= this.r;
    }
    
    overlaps(bot) {
        const dist = this.manhattan(bot);
        const radiiSum = this.r + bot.r;
        return radiiSum >= dist;
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

function mean(numbers) {
    const sum = _.sum(numbers);
    return sum / numbers.length;
}

function median(numbers) {
    const nn = numbers.concat();
    nn.sort();
    if (nn.length % 2 === 0) {
        const a = nn[nn.length / 2 - 1];
        const b = nn[nn.length / 2];
        return (a + b) / 2;
    } else {
        return nn[(nn.length - 1) / 2];
    }
}

function centerOfMass(bots) {
    const mass = (bot) => bot.r;
    const center = (component) => {
        const t = bots.reduce((sum, b) => sum + b[component] * mass(b), 0);
        const n = _.sumBy(bots, mass);
        return t / n;
    };
    const cx = Math.round(center("x"));
    const cy = Math.round(center("y"));
    const cz = Math.round(center("z"));
    return new NanoBot(cx, cy, cz, 0);
}

function part2(lines) {
    const myPos = new NanoBot(0, 0, 0, 0);
    let bots = lines.map(NanoBot.parse);

    const groups = [];
    while (bots.length > 0) {
        const bot = bots.shift();
        const group = [bot];
        for (const b of bots) {
            if (group.every((x) => x.overlaps(b))) {
                group.push(b);
            }
        }

        groups.push(group);

        bots = bots.filter((b) => group.indexOf(b) < 0);
    }

    const largestGroupSize = _.maxBy(groups, (g) => g.length).length;
    const largestGroups = groups.filter((g) => g.length === largestGroupSize);

    const positions = largestGroups.map((g) => {
        return centerOfMass(g);
    });
    if (positions.length === 0) throw new Error("no positions");
    const x = _.minBy(positions, (p) => myPos.manhattan(p));
    return myPos.manhattan(x);
}

module.exports = { part1, part2, NanoBot };
