const utils = require("../utils_js/utils");
const main = require("./main");

describe("part1", () => {
    it("works for the examples", () => {
        const lines = utils.readLines("example");
        expect(main.part1(lines)).toBe(7);
    });

    it("works for the input", () => {
        const lines = utils.readLines("input");
        expect(main.part1(lines)).toBe(943);
    });
});