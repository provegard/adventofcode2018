const utils = require("../utils_js/utils");
const main = require("./main");

describe("part2", () => {
    it("works for the input", () => {
        const lines = utils.readLines("input");
        const regex = lines[0];
        expect(main.part2(regex)).toBe(8514);
    });
});