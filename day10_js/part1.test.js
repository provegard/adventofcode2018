const utils = require("../utils_js/utils");
const day10 = require("./day10");

describe("part1", () => {
    it("works for the examples", () => {
        const lines = utils.readLines("example");
        day10.part1(lines);
    });

    it("works for the input", () => {
        const lines = utils.readLines("input");
        day10.part1(lines);
    });
});