const utils = require("../utils_js/utils");
//const Iterator = utils.Iterator;

class Node {
    constructor(children, metadataEntries) {
        this.children = children;
        this.metadataEntries = metadataEntries;
    }

    sumMetadataEntries() {
        let sum = 0;
        for (const entry of this.metadataEntries) {
            sum += entry;
        }
        for (const child of this.children) {
            sum += child.sumMetadataEntries();
        }
        return sum;
    }

    sumMetadataEntriesAsIndexes() {
        if (this.children.length === 0) {
            return this.sumMetadataEntries();
        }

        let sum = 0;
        for (const indexBase1 of this.metadataEntries) {
            if (indexBase1 === 0) continue;
            const child = this.children[indexBase1 - 1];
            if (!child) continue;
            sum += child.sumMetadataEntriesAsIndexes();
        }
        return sum;
    }
}

function readNode(numbers) {
    const childCount = numbers.shift();
    const metadataCount = numbers.shift();
    const children = [];
    for (let i = 0; i < childCount; i++) {
        children.push(readNode(numbers));
    }
    const metadataEntries = [];
    for (let i = 0; i < metadataCount; i++) {
        metadataEntries.push(numbers.shift());
    }
    return new Node(children, metadataEntries);
}

function buildTree(numbers) {
    return readNode(numbers);
}

function part1(numberString) {
    const numbers = numberString.split(" ").map((n) => parseInt(n));
    const tree = buildTree(numbers);
    return tree.sumMetadataEntries();
}

function part2(numberString) {
    const numbers = numberString.split(" ").map((n) => parseInt(n));
    const tree = buildTree(numbers);
    return tree.sumMetadataEntriesAsIndexes();
}

module.exports = { part1, part2 };