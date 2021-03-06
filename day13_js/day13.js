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
        this.crashed = false;
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
        if (this.crashed || other.crashed) return false;
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
        if (this.crashed) return;
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

    findCollidingCarts(cart) {
        return this.carts.filter((c) => c !== cart && c.collidesWith(cart));
    }

    *tick() {
        while (this.carts.length > 1) {
            //this.print();
            for (const cart of this.carts) {
                cart.move(this.map);
                for (const coll of this.findCollidingCarts(cart)) {
                    yield [cart, coll];
                    cart.crashed = true;
                    coll.crashed = true;
                }
            }
            this.removeCrashedCarts();
        }
    }

    removeCrashedCarts() {
        this.carts = this.carts.filter((c) => !c.crashed);
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
    const world = parse(lines.concat());
    const gen = world.tick();
    // consume collisions
    for (const _ of gen) {}
    const cart = world.carts[0];
    return [cart.x, cart.y];

}

module.exports = { part1, part2 };
