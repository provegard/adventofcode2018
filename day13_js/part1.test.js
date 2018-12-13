const utils = require("../utils_js/utils");
const Day13 = require("./day13");

describe("part1", () => {
    it("works for the 1st example", () => {
        const lines = [
            "|",
            "v",
            "|",
            "|", 
            "|",
            "^",
            "|"]
        expect(Day13.part1(lines)).toEqual([0, 3]);
    });

    it("works for the 2nd example", () => {
        const lines = [
            "/->-\\",        
            "|   |  /----\\",
            "| /-+--+-\\  |",
            "| | |  | v  |",
            "\\-+-/  \\-+--/",
            "  \\------/   "
        ];
        expect(Day13.part1(lines)).toEqual([7, 3]);
    });

    it("works for the input", () => {
        const lines = utils.readLines("input");
        expect(Day13.part1(lines)).toEqual([136, 36]);
    });
});