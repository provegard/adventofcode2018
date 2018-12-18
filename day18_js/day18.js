const utils = require("../utils_js/utils");
const _ = require("lodash");
const Iterator = utils.Iterator;

const count = (acres, type) => acres.filter((a) => a === type).length;

class State {
    constructor(rows) {
        this.maxY = rows.length - 1;
        this.maxX = rows[0].length - 1;
        this.rows = rows;
    }

    at(x, y) {
        return this.rows[y][x];
    }

    adjacentTo(x, y) {
        const ys = _.range(y - 1, y + 2);
        const xs = _.range(x - 1, x + 2);
        return _.flatMap(ys, (y_) => xs.map((x_) => [x_, y_]))
            .filter(([x_, y_]) => !(x_ === x && y_ === y))
            .filter(([x_, y_]) => x_ >= 0 && y_ >= 0 && x_ <= this.maxX && y_ <= this.maxY)
            .map(([x_, y_]) => this.at(x_, y_));
    }

    transform() {
        this.rows = this.rows.map((row, y) =>
            row.map((acre, x) => {
                const adjacent = this.adjacentTo(x, y);
                switch (acre) {
                    case ".":
                        if (count(adjacent, "|") >= 3) return "|";
                        break;
                    case "|":
                        if (count(adjacent, "#") >= 3) return "#";
                        break;
                    case "#":
                        const treeCount = count(adjacent, "|");
                        const lumberCount = count(adjacent, "#");
                        if (!(treeCount >= 1 && lumberCount >= 1)) return ".";
                        break;
                }
                return acre; // remain the same
            })
        );
    }

    treeCount() {
        return _.flatMap(this.rows, (r) => r.filter((a) => a === "|")).length;
    }

    lumberCount() {
        return _.flatMap(this.rows, (r) => r.filter((a) => a === "#")).length;
    }

    toString() {
        return this.rows.map((r) => r.join("")).join("\n");
    }
}

function toRows(lines) {
    return lines.map((l) => l.split(""));
}

function part1(lines) {
    const s = new State(toRows(lines));
    for (let i = 0; i < 10; i++) s.transform();
    return s.treeCount() * s.lumberCount();
}

function *generate(state) {
    let minute = 0;
    while (true) {
        yield [minute++, state.toString()];
        state.transform();
    }
}

function part2(lines) {
    const s = new State(toRows(lines));
    const seen = {};
    for (const [minute, stateString] of generate(s)) {
        const lastMinuteSeen = seen[stateString]; 
        if (lastMinuteSeen !== undefined) {
            // after _minute_ minutes, we see a state that is the same as after _lastMinuteSeen_ minutes
            // lastMinuteSeen = 400
            // minute = 428
            const periodicity = minute - lastMinuteSeen;
            const rem = (1000000000 - lastMinuteSeen) % periodicity;
            for (let i = 0; i < rem; i++) s.transform();
            return s.treeCount() * s.lumberCount();
        }
        seen[stateString] = minute;
    }
}

module.exports = { part1, part2 };
