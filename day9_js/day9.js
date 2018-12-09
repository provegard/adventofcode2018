const utils = require("../utils_js/utils");
const Iterator = utils.Iterator;

class Circle {

    constructor() {
        this.marbles = [0];
        this.currentIndex = 0;
        this.scoreByPlayer = {};
    }

    indexFromDelta(delta) {
        let idx = this.currentIndex + delta;
        if (idx < 0) idx += this.marbles.length;
        return idx % this.marbles.length;
    }

    insertMarble(playerNumber, worth) {
        if (worth % 23 === 0) {
            let score = worth;
            const removeIdx = this.indexFromDelta(-7);
            const removed = this.marbles.splice(removeIdx, 1);
            this.currentIndex = removeIdx;
            score += removed[0];
            this.scoreByPlayer[playerNumber] = (this.scoreByPlayer[playerNumber] || 0) + score;
        } else {
            const placeIdx = this.indexFromDelta(1) + 1;
            this.marbles.splice(placeIdx, 0, worth);
            this.currentIndex = placeIdx;
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
    const circle = new Circle();
    for (let i = 0; i < lastMarbleWorth; i++) {
        let player = i % playerCount;
        circle.insertMarble(player + 1, i + 1); // 1-based
    }
    return circle.highestScore();
}

function part2() {
}

module.exports = { part1, part2 };