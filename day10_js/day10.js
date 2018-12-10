const utils = require("../utils_js/utils");
const Iterator = utils.Iterator;

class Light {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
    }

    move() {
        this.x += this.vx;
        this.y += this.vy;
    }

    moved() {
        return new Light(this.x + this.vx, this.y + this.vy, this.vx, this.vy);
    }
}

function parseLine(line) {
    // position=< 11153,  22033> velocity=<-1, -2>
    const parts = line.split(/[<>,]/);
    const x = parseInt(parts[1].trim());
    const y = parseInt(parts[2].trim());
    const vx = parseInt(parts[4].trim());
    const vy = parseInt(parts[5].trim());
    return new Light(x, y, vx, vy);
}

function linesToLights(lines) {
    return lines.filter((l) => l && l.trim()).map(parseLine);
}

function boundingBox(lights) {
    let minX = 1e9;
    let minY = 1e9;
    let maxX = -1e9;
    let maxY = -1e9;
    for (const light of lights) {
        minX = Math.min(minX, light.x);
        minY = Math.min(minY, light.y);
        maxX = Math.max(maxX, light.x);
        maxY = Math.max(maxY, light.y);
    }
    return {minX, minY, maxX, maxY};
}

function print(lights) {
    const {minX, minY, maxX, maxY} = boundingBox(lights);
    const lines = [];
    for (let y = minY; y <= maxY; y++) {
        const leds = [];
        for (let x = minX; x <= maxX; x++) {
            leds.push(".");
        }
        lines.push(leds);
    }
    for (const light of lights) {
        const displayX = light.x - minX;
        const displayY = light.y - minY;
        lines[displayY][displayX] = "#";
    }
    const displayText = lines.map((leds) => leds.join("")).join("\r\n");
    console.log(displayText);
}

function moveAll(lights) {
    return lights.map((l) => l.moved());
}

function part1(lines) {
    let lights = linesToLights(lines);
    const bbSize = (ls) => {
        const {minX, minY, maxX, maxY} = boundingBox(ls);
        return (maxX - minX) * (maxY - minY);
    }

    let bb = bbSize(lights);
    let iter = 0;
    while (iter++ < 100000) {
        const newLights = moveAll(lights);
        const newBB = bbSize(newLights);
        if (newBB > bb) {
            // converged, then diverged again
            print(lights);
            throw "message after " + (iter-1) + " seconds"; // force jest to show the console
        }
        bb = newBB;
        lights = newLights;
    }
    throw "didn't find";
}

function part2() {
}

module.exports = { part1, part2 };
