const utils = require("../utils_js/utils");
const Day18 = require("./day18");

describe("part2", () => {
    it("works for the input", () => {
        const lines = utils.readLines("input");
        // 205907 is wrong
        expect(Day18.part2(lines)).toBe(211653);
    });
});