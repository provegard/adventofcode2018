const utils = require("../utils_js/utils");
const part1 = require("./part1");

describe("part1", () => {
    it("works for the example", () => {
        const numbers = "2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2";
        const result = part1.part1(numbers);
        expect(result).toBe(138);
    });

    it("works for the input", () => {
        const lines = utils.readLines("input");
        const result = part1.part1(lines[0]);
        expect(result).toBeNull();
    });
});