const utils = require("../utils_js/utils");
const day8 = require("./day8");

describe("part2", () => {
    it("works for the example", () => {
        const numbers = "2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2";
        const result = day8.part2(numbers);
        expect(result).toBe(66);
    });

    it("works for the input", () => {
        const lines = utils.readLines("input");
        const result = day8.part2(lines[0]);
        expect(result).toBe(32487);
    });
});