const utils = require("../utils_js/utils");
const day9 = require("./day9");

describe("part1", () => {
    it("works for the examples", () => {
        expect(day9.part1(9, 25)).toBe(32);
        expect(day9.part1(10, 1618)).toBe(8317);
        expect(day9.part1(13, 7999)).toBe(146373);
        expect(day9.part1(17, 1104)).toBe(2764);
        expect(day9.part1(21, 6111)).toBe(54718);
        expect(day9.part1(30, 5807)).toBe(37305);
    });

    it("works for the input", () => {
        const result = day9.part1(403, 71920);
        expect(result).toBe(439089);
    });
});