const utils = require("../utils_js/utils");
const day12 = require("./day12");

describe("part2", () => {
    it("works for the input 1", () => {
        const lines = utils.readLines("input");
        expect(day12.part1(lines, 200)).toBe(9684);
        expect(day12.part1(lines, 400)).toBe(17684);
        expect(day12.part1(lines, 1000)).toBe(41684);
        expect(day12.part1(lines, 50000000000)).toBe(2000000001684);
    });
});