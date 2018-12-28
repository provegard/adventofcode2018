const utils = require("../utils_js/utils");
const _ = require("lodash");

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
        if (!row) return value;
        const colIdx = x - this.minX;
        if (colIdx < 0 || colIdx >= row.length) return value;
        row[colIdx] = value;
        return value;
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

    scan(x, y, dir) {
        const type = this.at(x, y);
        if (type === "#") return x - dir; // return edge of water 
        const typeBelow = this.findType(x, y + 1);
        if (typeBelow === "|") return false;
        return this.scan(x + dir, y, dir); 
    }

    findType(x, y, x_dir = 0) {
        if (y > this.maxY) return "|"; // infinite way down
        const type = this.at(x, y);
        if (type !== ".") return type; // already done

        const typeBelow = this.findType(x, y + 1);
        if (x_dir === 0) {
            // going down
            if (typeBelow === "|") {
                return this.updateAt(x, y, "|");
            }
            // assume typeBelow is # or ~
            // scan left and right to see if we can create water at rest
            const leftEdge = this.scan(x - 1, y, -1);
            const rightEdge = (leftEdge !== false) && this.scan(x + 1, y, 1);
            if (leftEdge === false || rightEdge === false) {
                // no water at rest
                this.findType(x - 1, y, -1);
                this.findType(x + 1, y, 1);
                return this.updateAt(x, y, "|");
            } else {
                // create water at rest
                for (let xx = leftEdge; xx <= rightEdge; xx++) {
                    this.updateAt(xx, y, "~");
                }
                return "~";
            }
        } else {
            if (typeBelow !== "|") {
                this.findType(x + x_dir, y, x_dir);
            }
            return this.updateAt(x, y, "|");
        }
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
    const rows = _.range(minY, maxY + 1).map((y) => {
        const entriesForY = entries.filter((e) => e.ys.includes(y));
        const xs = _.flatMap(entriesForY, (e) => e.xs);
        return _.range(minX, maxX + 1).map((x) => xs.includes(x) ? "#" : ".");
    });
    return new Ground(minX, minY, rows);
}

function run(lines) {
    const ground = parseLines(lines);
    //console.log(ground.render());
    ground.findType(500, 1);
    //console.log("");
    //console.log(ground.render());
    return ground;
}

function part1(lines) {
    return run(lines).reachableTileCount();
}

function part2(lines) {
    return run(lines).actualWaterCount();
}

module.exports = { part1, part2, parseLine };