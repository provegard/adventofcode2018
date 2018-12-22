const _ = require("lodash");

class Pos {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.key = x + "," + y;
    }

    eq(pos) {
        return this.x === pos.x && this.y === pos.y;
    }

    offset(x, y) {
        return new Pos(this.x + x, this.y + y);
    }

    *neighbors() {
        yield this.offset(-1, 0);
        yield this.offset(0, -1);
        yield this.offset(1, 0);
        yield this.offset(0, 1);
    }

    manhattan(pos) {
        return Math.abs(this.x - pos.x) + Math.abs(this.y - pos.y);
    }
}
Pos.Zero = new Pos(0, 0);

class EquippedAtPos {
    constructor(pos, equipment) {
        this.pos = pos;
        this.equipment = equipment;
        this.key = this.pos.key + "," + equipment;
    }

    eq(other) {
        return this.pos.eq(other.pos) && this.equipment === other.equipment;
    }
}

function typeForErosionLevel(level) {
    switch (level % 3) {
        case 0: return "rocky";
        case 1: return "wet";
        case 2: return "narrow";
        default: throw new Error("typeForErosionLevel " + level);
    }
}

class Cave {
    constructor(depth, target) {
        this.target = target;
        this.depth = depth;
        this.geoCache = {};
    }

    geoIndexAt(pos) {
        if (pos.eq(Pos.Zero)) return 0;
        if (pos.eq(this.target)) return 0;
        const key = pos.key;
        let value = this.geoCache[key];
        if (value !== undefined) return value;
        if (pos.y === 0) {
            value = pos.x * 16807;
        } else if (pos.x === 0) {
            value = pos.y * 48271;
        } else {
            value = this.erosionAt(pos.offset(-1, 0)) * this.erosionAt(pos.offset(0, -1));
        }
        this.geoCache[key] = value;
        return value;
    }

    erosionAt(pos) {
        const geoIdx = this.geoIndexAt(pos);
        return (geoIdx + this.depth) % 20183;
    }

    typeAtPos(pos) {
        const level = this.erosionAt(pos);
        return typeForErosionLevel(level);
    }
}

function possibleEquipment(type) {
    switch (type) {
        case "rocky": return new Set(["climbing", "torch"]);
        case "wet": return new Set(["climbing", "neither"]);
        case "narrow": return new Set(["torch", "neither"])
        default: throw new Error("possibleEquipment " + type);
    }
}

function valueOrInf(map, x) {
    const value = map[x.key];
    if (typeof value === "undefined") return 1e12;
    return value;
}
function astarDistance(start, goal, nbs, dist, h) {
    const closedSet = new Set();
    const openList = [start];
    //const parents = {};
    const g = {};
    g[start.key] = 0;
    const f = {};
    f[start.key] = h(start, goal);
    while (openList.length > 0) {
        openList.sort((a, b) => valueOrInf(f, a) - valueOrInf(f, b));
        const current = openList.shift();
        //console.log(current);
        if (current.eq(goal)) {
            return g[goal.key];
        }

        closedSet.add(current.key);
        for (const neighbor of nbs(current)) {
            if (closedSet.has(neighbor.key)) continue;

            const t_g = g[current.key] + dist(current, neighbor);
            if (!openList.find((p) => p.eq(neighbor))) {
                openList.push(neighbor);
            } else if (t_g >= valueOrInf(g, neighbor)) {
                continue;
            }

            //parents[neighbor.key] = current;
            g[neighbor.key] = t_g;
            f[neighbor.key] = t_g + h(neighbor, goal);
        }
    }
    throw new Error("???");
}

function intersect(a, b) {
    return Array.from(a).filter((x) => b.has(x));
}

function run(depth, target) {
    const cave = new Cave(depth, target);
    const nbs = (epos) => {
        const pos = epos.pos;
        const thisEquip = possibleEquipment(cave.typeAtPos(pos));
        const possible = Array.from(pos.neighbors())
            .filter((nb) => nb.x >= 0 && nb.y >= 0)
        return _.flatMap(possible, (nb) => {
            const nbEquip = possibleEquipment(cave.typeAtPos(nb));
            return intersect(thisEquip, nbEquip).map((e) => new EquippedAtPos(nb, e));
        });
    };
    const dist = (a, b) => {
        const switchNeeded = a.equipment !== b.equipment;
        return 1 + (switchNeeded ? 7 : 0);
    };
    const h = (a, b) => a.pos.manhattan(b.pos);
    const start = new EquippedAtPos(Pos.Zero, "torch");
    const goal = new EquippedAtPos(target, "torch");
    const result = astarDistance(start, goal, nbs, dist, h);
    console.log(result);
}

run(510, new Pos(10, 10)); // 45
run(3879, new Pos(8, 713)); // 982
