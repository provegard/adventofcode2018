const utils = require("../utils_js/utils");
const Day17 = require("./day17");

describe("part1", () => {
    it("works for the example", () => {
        const lines = [
            "x=495, y=2..7",
            "y=7, x=495..501",
            "x=501, y=3..7",
            "x=498, y=2..4",
            "x=506, y=1..2",
            "x=498, y=10..13",
            "x=504, y=10..13",
            "y=13, x=498..504",
        ];
        expect(Day17.part1(lines)).toBe(57);
    });

    it("works for the input", () => {
        const lines = utils.readLines("input");
        // 56222 is too high
        // 38463 is too high
        expect(Day17.part1(lines)).toBe(38451);
        
/*
...........|.............|....
...........||||||||||||||||...
..|||||||||||||||||||||||#|...
..|#~~~~~~~~~~~~~~~~~~~~~#|...
..|#~~~~~~~~~~~~~~~~~~~~~#|...
*/

    });

    it("parses a line with x first", () => {
        const line = "x=495, y=2..3";
        expect(Day17.parseLine(line)).toEqual({
            xs: [495],
            ys: [2, 3]
        });
    })

    it("parses a line with y first", () => {
        const line = "y=7, x=12..13";
        expect(Day17.parseLine(line)).toEqual({
            xs: [12, 13],
            ys: [7]
        });
    })

    it("can replace potential water with water", () => {
        const line = "#||#||#".split("");
        const result = Day17.replaceWithWater(line);
        expect(result.join("")).toBe("#~~#~~#");
    });
});