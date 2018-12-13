const utils = require("../utils_js/utils");
const Day13 = require("./day13");

describe("part2", () => {
    it("works for the example", () => {
        const lines = [
            "/>-<\\",  
            "|   |",  
            "| /<+-\\",
            "| | | v",
            "\\>+</ |",
            "  |   ^",
            "  \\<->/"
        ];
        expect(Day13.part2(lines)).toEqual([6, 4]);
    });
    it("works for the input", () => {
        const lines = utils.readLines("input");
        // 121,83 wrong
        // 121,82 wrong
        expect(Day13.part2(lines)).toEqual([]);
    });
});