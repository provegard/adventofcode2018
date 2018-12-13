const utils = require("../utils_js/utils");
const Iterator = utils.Iterator;

const LEFT = 0;
const STRAIGHT = 1;
const RIGHT = 2;

const NORTH = 0;
const EAST = 1;
const SOUTH = 2;
const WEST = 3;

class Cart {
    constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.turnDirection = LEFT;
        this.direction = direction;
    }

    arrow() {
        switch (this.direction) {
            case NORTH: return "^";
            case EAST: return ">";
            case WEST: return "<";
            case SOUTH: return "v";
        }
        return "?";
    }

    collidesWith(other) {
        return this.x === other.x && this.y === other.y;
    }

    nextPos() {
        switch (this.direction) {
            case NORTH: return {x: this.x, y: this.y-1};
            case EAST: return {x: this.x+1, y: this.y};
            case SOUTH: return {x: this.x, y: this.y+1};
            case WEST: return {x: this.x-1, y: this.y};
            default:
                throw new Error("Unknown direction");
        }
    }

    newDirection(turnDirection) {
        let newDir = this.direction;
        if (turnDirection === LEFT) {
            newDir = this.direction - 1;
            if (newDir < NORTH) newDir = WEST;
        }
        if (turnDirection === RIGHT) {
            newDir = this.direction + 1;
            if (newDir > WEST) newDir = NORTH;
        }
        return newDir;
    }

    useTurnDirection() {
        const d = this.turnDirection;
        this.turnDirection += 1;
        if (this.turnDirection > RIGHT) this.turnDirection = LEFT;
        return d;
    }

    move(theMap) {
        const {x, y} = this.nextPos();
        let newDir = this.direction;
        let turnDir;
        switch (theMap.pathAt(x, y)) {
            case "/":
                switch(this.direction) {
                    case NORTH: turnDir = RIGHT; break;
                    case SOUTH: turnDir = RIGHT; break;
                    case EAST: turnDir = LEFT; break;
                    case WEST: turnDir = LEFT; break;
                }
                newDir = this.newDirection(turnDir);
                break;
            case "\\":
                switch(this.direction) {
                    case NORTH: turnDir = LEFT; break;
                    case SOUTH: turnDir = LEFT; break;
                    case WEST: turnDir = RIGHT; break;
                    case EAST: turnDir = RIGHT; break;
                }
                newDir = this.newDirection(turnDir);
                break;
            case "+":
                newDir = this.newDirection(this.useTurnDirection());
                break;
        }
        this.x = x;
        this.y = y;
        this.direction = newDir;
    }
}

class World {
    constructor(map, carts) {
        this.map = map;
        this.carts = carts;
    }

    sortCarts() {
        this.carts.sort((a, b) => a.y - b.y || a.x - b.x);
    }

    *tick() {
        this.sortCarts();
        while (true) {
            //this.print();
            // sorted at each loop entry
            this.carts.forEach((cart) => cart.move(this.map));
            // sort to find collision
            this.sortCarts();
            let prev;
            for (const cart of this.carts) {
                if (prev && cart.collidesWith(prev)) {
                    yield [prev, cart];
                }
                prev = cart;
            }
        }
    }

    print() {
        this.map.print(this.carts);
    }
}

class TheMap {
    constructor() {
        this.map = []; // 2-dim array
    }

    setPath(x, y, path) {
        const row = (this.map[y] || (this.map[y] = []));
        row[x] = path;
    }

    pathAt(x, y) {
        const row = this.map[y];
        return row && row[x];
    }

    print(carts) {
        const str = utils.zipWithIndex(this.map).map(([r, y]) => {
            return utils.zipWithIndex(r).map(([cell, x]) => {
                const cart = carts.find((c) => c.x === x && c.y === y);
                const value = cart ? cart.arrow() : cell;
                return value;
            }).join("");
        }).join("\r\n");
        console.log(str);
    }
}

function parse(lines) {
    const carts = [];
    const map = new TheMap();
    lines.forEach((line, y) => {
        line.split("").forEach((cell, x) => {
            let cart, path = cell;
            switch (cell) {
                case "<":
                    cart = new Cart(x, y, WEST);
                    path = "-";
                    break;
                case ">":
                    cart = new Cart(x, y, EAST);
                    path = "-";
                    break;
                case "^":
                    cart = new Cart(x, y, NORTH);
                    path = "|";
                    break;
                case "v":
                    cart = new Cart(x, y, SOUTH);
                    path = "|";
                    break;
                case " ":
                    break;
            }
            if (cart) carts.push(cart);
            map.setPath(x, y, path);
        });
    });
    return new World(map, carts);
}

function part1(lines) {
    const world = parse(lines.concat());
    const gen = world.tick();
    const carts = gen.next().value;
    return [carts[0].x, carts[0].y];
}

function part2(lines) {

}

module.exports = { part1, part2 };
