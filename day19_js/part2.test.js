const utils = require("../utils_js/utils");
const Day19 = require("./day19");

describe("part2", () => {
    it("works for the input", () => {
        const lines = utils.readLines("input");
        const result = Day19.part2(lines);
        expect(result).toBe(12768192);
    });
});