const utils = require("../utils_js/utils");
const Day16 = require("./day16");

describe("part1", () => {
    it("works for the example", () => {
        const example = {
            before: [3, 2, 1, 1],
            instruction: [9, 2, 1, 2],
            after: [3, 2, 2, 1],
        }
        expect(Day16.behaves_like(example)).toBe(3);
    });

    it("can identify functions", () => {
        const example = {
            before: [3, 2, 1, 1],
            instruction: [9, 2, 1, 2],
            after: [3, 2, 2, 1],
        }
        expect(Day16.functions_that_fit(example).sort()).toEqual(["addi", "mulr", "seti"]);
    });

    it("can parse lines", () => {
        const lines = [
            "Before: [3, 2, 1, 1]",
            "9 2 1 2",
            "After:  [3, 2, 2, 1]",
        ];
        const example = {
            before: [3, 2, 1, 1],
            instruction: [9, 2, 1, 2],
            after: [3, 2, 2, 1],
        }
        const examples = Array.from(Day16.parse(lines));
        expect(examples).toEqual([example]);
    });

    it("works for the input", () => {
        const lines = utils.readLines("input");
        expect(Day16.part1(lines)).toBe(624);    
    });
});