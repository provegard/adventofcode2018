const utils = require("../utils_js/utils");
const _ = require("lodash");
const Iterator = utils.Iterator;

function replaceWithWater(r) {
    const str = r.join("").replace(/#\|*\|(?=#)/g, s => s.replace(/\|/g, "~"));
    return str.split("");
}

class Ground {
    constructor(minX, minY, rows) {
        this.minX = minX;
        this.minY = minY;
        this.rows = rows;

        this.maxY = this.minY + this.rows.length - 1;
        this.maxX = this.minX + this.rows[0].length - 1;
    }

    render() {
        return this.rows.map((r) => r.join("")).join("\r\n");
    }

    at(x, y) {
        const rowIdx = y - this.minY;
        const row = this.rows[rowIdx];
        if (!row) return ".";
        const colIdx = x - this.minX;
        return row[colIdx] || ".";
    }

    updateAt(x, y, value) {
        const rowIdx = y - this.minY;
        const row = this.rows[rowIdx];
        if (!row) return;
        const colIdx = x - this.minX;
        if (colIdx < 0 || colIdx >= row.length) return;
        row[colIdx] = value;
    }

    flow() {
        this.track(500, 1);
    }

    fill() {
        this.rows = this.rows.map(replaceWithWater);
    }

    reachableTileCount() {
        return _.sumBy(this.rows, (row) =>
            _.sumBy(row, (e) => (e === "|" || e === "~") ? 1 : 0)
        );
    }

    actualWaterCount() {
        return _.sumBy(this.rows, (row) =>
            _.sumBy(row, (e) => e === "~" ? 1 : 0)
        );
    }

    hasWallTo(x, y, x_dir) {
        const limit = x_dir < 0 ? this.minX - 1 : this.maxX + 1;
        while ((x += x_dir) !== limit) {
            if (this.at(x, y) === "#") return true;
            if (this.at(x, y + 1) === ".") return false;
        }
        return false;
    }

    track(x, y, x_dir = 0) {
        const type = this.at(x, y);
        if (type === "|") return false; // done, merged
        if (type !== ".") return true; // done, hit something
        if (y > this.maxY) return false; // done, infinite way down

        this.updateAt(x, y, "|");
        const typeBelow = this.at(x, y + 1);
        if (typeBelow === "|" && x_dir === 0) {
            // water below, don't go there
            // track horizontal, but only if we're confined by two walls
            if (this.hasWallTo(x, y, -1) && this.hasWallTo(x, y, 1)) {
                return this.trackHorizontal(x, y);
            }
            return false;
        }
        if (typeBelow === ".") {
            // Sand below, so go down
            if (this.track(x, y + 1)) {
                // filled below, so check sides / continue in one direction
                return this.trackHorizontal(x, y, x_dir);
            }
            return false;
        } else {
            return this.trackHorizontal(x, y, x_dir);
        }
    }

    trackHorizontal(x, y, x_dir = 0) {
        if (x_dir !== 0) {
            return this.track(x + x_dir, y, x_dir);
        } else {
            return this.trackLeftRight(x, y);
        }
    }

    trackLeftRight(x, y) {
        const a = this.track(x - 1, y, -1);
        const b = this.track(x + 1, y, 1);
        return a && b;
    }
}

function parseLine(line) {
    // [ 'x', '495', '', 'y', '2', '7' ]
    if (line.indexOf("..") < 0) throw new Error(line);
    const parts = line.split(/[=, .]/);
    const a = +parts[1];
    const b = +parts[4];
    const c = +parts[6];
    if (parts[0] === "x") {
        // a is x, b..c is range of ys
        return {xs: [a], ys: _.range(b, c + 1)};
    } else {
        // a is y, b..c is range of xs
        return {ys: [a], xs: _.range(b, c + 1)};
    }
}

function parseLines(lines) {
    // x=495, y=2..7
    const entries = lines.map(parseLine);
    const allXs = _.flatMap(entries, (e) => e.xs);
    const allYs = _.flatMap(entries, (e) => e.ys);
    const minY = _.min(allYs);
    const maxY = _.max(allYs);
    // +/-1 to allow for downwards flow outside of a reservoir on the edge
    const minX = _.min(allXs) - 1;
    const maxX = _.max(allXs) + 1;
    console.log([minY, maxY, minX, maxX]);
    const rows = _.range(minY, maxY + 1).map((y) => {
        const entriesForY = entries.filter((e) => e.ys.includes(y));
        const xs = _.flatMap(entriesForY, (e) => e.xs);
        return _.range(minX, maxX + 1).map((x) => xs.includes(x) ? "#" : ".");
    });
    return new Ground(minX, minY, rows);
}

function run(lines) {
    const ground = parseLines(lines);
    console.log(ground.render());
    ground.flow();
    //console.log(ground.render());
    ground.fill();
    console.log(ground.render());
    return ground;
}

function part1(lines) {
    return run(lines).reachableTileCount();
}

function part2(lines) {
    return run(lines).actualWaterCount();
}

module.exports = { part1, part2, parseLine, replaceWithWater };
