const utils = require("../utils_js/utils");
const main = require("./main");

describe("part2", () => {
    it("works for the example", () => {
        const lines = utils.readLines("example");
        expect(main.part2(lines)).toBe(51);
    });

    it("works for the input", () => {
        const lines = utils.readLines("input");
        expect(main.part2(lines)).toBe(8698);
    });
});