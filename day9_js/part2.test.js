const utils = require("../utils_js/utils");
const day9 = require("./day9");

describe("part2", () => {
    it("works for the input", () => {
        const result = day9.part1(403, 71920 * 100);
        expect(result).toBe(3668541094);
    });
});