const utils = require("../utils_js/utils");

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

module.exports = { part1 };