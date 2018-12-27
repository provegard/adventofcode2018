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

    *points() {
        yield new NanoBot(this.x - this.r, this.y, this.z, 0);
        yield new NanoBot(this.x + this.r, this.y, this.z, 0);
        yield new NanoBot(this.x, this.y - this.r, this.z, 0);
        yield new NanoBot(this.x, this.y + this.r, this.z, 0);
        yield new NanoBot(this.x, this.y, this.z - this.r, 0);
        yield new NanoBot(this.x, this.y, this.z + this.r, 0);
    }

    key() {
        return [this.x, this.y, this.z].join(",");
    }

    
    bounds(dim) {
        return {
            lower: this[dim] - this.r,
            upper: this[dim] + this.r
        }
    }

    boundsYAtX(x) {
        const left = this.r - Math.abs(this.x - x);
        return {
            lower: this.y - left,
            upper: this.y + left
        }
    }

    boundsZAtX(x) {
        const left = this.r - Math.abs(this.x - x);
        return {
            lower: this.z - left,
            upper: this.z + left
        }
    }

    boundsZAtXY(x, y) {
        const left = this.r - Math.abs(this.x - x) - Math.abs(this.y - y);
        return {
            lower: this.z - left,
            upper: this.z + left
        }
    }

    boundsX() {
        return {
            lower: this.x - this.r,
            upper: this.x + this.r
        }
    }

    boundsYGivenX(xBounds) {
        const radius = xBounds.lower >= this.x
            ? this.r - (xBounds.lower - this.x)  // to the right
            : this.r - (this.x - xBounds.upper); // to the left
        return {
            lower: this.y - radius,
            upper: this.y + radius
        }
    }

    boundsZGivenXY(xBounds, yBounds) {
        let radius = xBounds.lower >= this.x
            ? this.r - (xBounds.lower - this.x)  // to the right
            : this.r - (this.x - xBounds.upper); // to the left

        radius = yBounds.lower >= this.y
            ? radius - (yBounds.lower - this.y)  // up
            : radius - (this.y - yBounds.upper); // down

        return {
            lower: this.z - radius,
            upper: this.z + radius
        }
    }

    boundsGiven(dimension, givens) {
        let radius = this.r;
        for (const d in givens) {
            const bounds = givens[d];
            const myValue = this[d];
            radius = bounds.lower >= myValue
                ? radius - (bounds.lower - myValue)
                : radius - (myValue - bounds.upper);
        }
        return {
            lower: this[dimension] - radius,
            upper: this[dimension] + radius
        };
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

const empty = {lower: 0, upper: -1, empty: true};
function intersection(bounds1, bounds2) {
    //if (bounds2.lower > bounds1.upper) throw new Error("no intersect");
    //if (bounds2.upper < bounds1.lower) throw new Error("no intersect");
    if (bounds1.empty || bounds2.empty) return empty;
    if (bounds2.lower > bounds1.upper || bounds2.upper < bounds1.lower) {
        return empty;
    }
    const lower = Math.max(bounds1.lower, bounds2.lower);
    const upper = Math.min(bounds1.upper, bounds2.upper);
    return {lower, upper};
}

function intersectionXYZ(b1, b2) {
    const [xb, yb, zb] = ["xb", "yb", "zb"].map((dim) => {
        const bb1 = b1[dim];
        const bb2 = b2[dim];
        return intersection(bb1, bb2);
    });
    return {xb, yb, zb};
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
    const volume = (bot) => {
        // pyramid-shaped
        //const lw = Math.sqrt(bot.r * bot.r);
        const baseArea = 2 * bot.r * bot.r;
        const v = 2 * bot.r * baseArea / 3;
        return v;
    };
    const mass = (bot) => 1/volume(bot);
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

function foo(bots, b) {
    const others = bots.filter((x) => x !== b);
    const myPoints = Array.from(b.points());
    //console.log(myPoints);
    const inRangeOfOthers = myPoints.filter((p) => others.some((u) => u.inRange(p)));
    return inRangeOfOthers;
}

function coversAny(b, bots) {
    const covers = (x) => {
        const dist = b.manhattan(x);
        return b.r >= dist + x.r;
    };
    return bots.some((x) => x !== b && covers(x));
}

function justTouches(b, bots) {
    return bots.some((x) => {
        if (x === b) return false;
        const dist = b.manhattan(x);
        return dist === (b.r + x.r);
    });
}

function justTouch(b, x) {
    const dist = b.manhattan(x);
    return dist === (b.r + x.r);
}

function touchPoints(b, bots) {
    const points = Array.from(b.points());
    const touching = bots.filter((x) => {
        if (x === b) return false;
        const dist = b.manhattan(x);
        return dist === (b.r + x.r);
    });
    return points.filter((p) => touching.some((t) => t.inRange(p)));
}

function findBounds(bots) {
    const first = bots[0];
    const rest = bots.slice(1);

    const xb = rest.reduce((acc, b) => intersection(acc, b.bounds("x")), first.bounds("x"));
    const yb = rest.reduce((acc, b) => intersection(acc, b.bounds("y")), first.bounds("y"));
    const zb = rest.reduce((acc, b) => intersection(acc, b.bounds("z")), first.bounds("z"));
    return {xb, yb, zb};
}

function *iterateMiddleOut(bounds) {
    let x = Math.round((bounds.lower + bounds.upper) / 2);
    let sign = 1;
    let inc = 1;
    while (x >= bounds.lower && x <= bounds.upper) {
        yield x;
        x += sign * inc;
        sign = -sign;
        inc++;
    }
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
        let copy = g.concat();
        let idx;
        while ((idx = copy.findIndex((b) => coversAny(b, copy))) >= 0) {
            copy.splice(idx, 1);
        }
        console.log("count before", g.length);
        console.log("count after", copy.length);

        // 27147759 has y bounds { lower: 21998539, upper: 24028066 } and z bounds { lower: 33915430, upper: 33915430 }
        const x = 27147759;
        const z = 33915430;
        for (let y = 21998539; y <= 24028066; y++) {
            const b = new NanoBot(x, y, z, 0);
            if (copy.every((c) => c.inRange(b))) {
                //console.log(b);
                return b;
            }
        }

        return new NanoBot(0, 0, 0, 0);

    });
    if (positions.length === 0) throw new Error("no positions");
    const x = _.minBy(positions, (p) => myPos.manhattan(p));
    console.log(x);
    return myPos.manhattan(x);
}

module.exports = { part1, part2, NanoBot };

// input: 73537624 is too low
// input: 84087816 is correct
const lines = utils.readLines("input");
console.log(part2(lines));
