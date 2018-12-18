const utils = require("../utils_js/utils");
const Day18 = require("./day18");

describe("part1", () => {
    it("works for the example", () => {
        const lines = utils.readLines("example");
        expect(Day18.part1(lines)).toBe(1147);
    });

    it("works for the input", () => {
        const lines = utils.readLines("input");
        expect(Day18.part1(lines)).toBe(574200);
    });
});