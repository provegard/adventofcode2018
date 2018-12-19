const utils = require("../utils_js/utils");
const Day19 = require("./day19");

describe("part1", () => {
    it("works for the example", () => {
        const lines = utils.readLines("example");
        const result = Day19.part1(lines);
        expect(result).toBe(6);
    });

    it("works for the input", () => {
        const lines = utils.readLines("input");
        const result = Day19.part1(lines);
        expect(result).toBe(1120);
    });
});