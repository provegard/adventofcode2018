const utils = require("../utils_js/utils");
const Iterator = utils.Iterator;

class ListItem {
    constructor(value, prev, next) {
        this.prev = prev;
        this.next = next;
        this.value = value;
    }
}

class DoubleLinkedList {
    constructor() {
        this.current = null;
    }

    _findItem(delta) {
        let cur = this.current;
        let steps = Math.abs(delta);
        while (steps-- > 0) {
            cur = delta > 0 ? cur.next : cur.prev;
        }
        return cur;
    }

    insertAtDelta(delta, value) {
        if (this.current) {
            const target = this._findItem(delta);
            // |target.prev|---|target|
            //               ^
            const newItem = new ListItem(value, target.prev, target);
            target.prev.next = newItem;
            target.prev = newItem;
            this.current = newItem;
        } else {
            this.current = new ListItem(value, null, null);
            this.current.next = this.current;
            this.current.prev = this.current;
        }
    }

    removeAtDelta(delta) {
        const target = this._findItem(delta);
        target.prev.next = target.next;
        target.next.prev = target.prev;
        this.current = target.next;
        return target.value;
    }
}

class Circle {

    constructor() {
        this.marbles = new DoubleLinkedList();
        this.marbles.insertAtDelta(0, 0);
        this.scoreByPlayer = {};
    }

    insertMarble(playerNumber, worth) {
        if (worth % 23 === 0) {
            let score = worth;
            score += this.marbles.removeAtDelta(-7);
            this.scoreByPlayer[playerNumber] = (this.scoreByPlayer[playerNumber] || 0) + score;
        } else {
            this.marbles.insertAtDelta(2, worth);
            // no score
        }
    }

    highestScore() {
        let high = 0;
        for (const k in this.scoreByPlayer) {
            let score = this.scoreByPlayer[k];
            high = Math.max(high, score);
        }
        return high;
    }
}

function part1(playerCount, lastMarbleWorth) {
    const circle = new Circle(lastMarbleWorth + 1);
    for (let i = 0; i < lastMarbleWorth; i++) {
        let player = i % playerCount;
        circle.insertMarble(player + 1, i + 1); // 1-based
    }
    return circle.highestScore();
}

function part2() {
}

module.exports = { part1, part2 };