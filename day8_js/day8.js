const utils = require("../utils_js/utils");
const Iterator = utils.Iterator;

class Node {
    constructor(children, metadataEntries) {
        this.children = children;
        this.metadataEntries = metadataEntries;
    }

    sumMetadataEntries() {
        return this.metadataEntries.reduce((s, e) => s + e, 0) +
            this.children.reduce((s, c) => s + c.sumMetadataEntries(), 0);
    }

    sumMetadataEntriesAsIndexes() {
        if (this.children.length === 0) {
            return this.sumMetadataEntries();
        }

        return this.metadataEntries.reduce((s, indexBase1) => {
            if (indexBase1 === 0) return s;
            const child = this.children[indexBase1 - 1];
            if (!child) return s;
            return s + child.sumMetadataEntriesAsIndexes();
        }, 0);
    }
}

function readNode(numbers) {
    const childCount = numbers.shift();
    const metadataCount = numbers.shift();

    const children = Array.from(
        Iterator.map(() => readNode(numbers),
        utils.range(0, childCount)));
    const metadataEntries = Array.from(
        Iterator.map(() => numbers.shift(),
        utils.range(0, metadataCount)));
    return new Node(children, metadataEntries);
}

function buildTree(numberString) {
    const numbers = numberString.split(" ").map((n) => parseInt(n));
    return readNode(numbers);
}

function part1(numberString) {
    return buildTree(numberString).sumMetadataEntries();
}

function part2(numberString) {
    return buildTree(numberString).sumMetadataEntriesAsIndexes();
}

module.exports = { part1, part2 };