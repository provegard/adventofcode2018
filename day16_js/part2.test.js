const utils = require("../utils_js/utils");
const Day16 = require("./day16");

describe("part2", () => {
    it("should work", () => {
        const lines = utils.readLines("input");
        const program = utils.readLines("test_program");
        expect(Day16.part2(lines, program)).toBe(584);    
    });
});