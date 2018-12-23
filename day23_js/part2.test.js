const utils = require("../utils_js/utils");
const main = require("./main");

describe("part2", () => {
    it("works for the example", () => {
        const lines = utils.readLines("example2");
        expect(main.part2(lines)).toBe(36);
    });

    fit("works for the input", () => {
        const lines = utils.readLines("input");
        // 38630826 is too low
        expect(main.part2(lines)).toEqual(null);
    });
});