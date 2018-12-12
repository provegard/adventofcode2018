const utils = require("../utils_js/utils");
const day12 = require("./day12");

describe("part1", () => {
    it("works for the examples", () => {
        const lines = utils.readLines("example");
        expect(day12.part1(lines)).toBe(325);
    });

    it("works for the input", () => {
        const lines = utils.readLines("input");
        expect(day12.part1(lines)).toBe(2840);
    });
});