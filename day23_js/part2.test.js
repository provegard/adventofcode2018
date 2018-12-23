const utils = require("../utils_js/utils");
const main = require("./main");

describe("part2", () => {
    it("works for the example", () => {
        const lines = utils.readLines("example2");
        expect(main.part2(lines)).toEqual(new main.Pos(12, 12, 12));
    });

    it("works for the input", () => {
        const lines = utils.readLines("input");
        expect(main.part2(lines)).toEqual(null);
    });
});