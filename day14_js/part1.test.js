const utils = require("../utils_js/utils");
const Day14 = require("./day14");

describe("part1", () => {
    it("combines", () => {
        expect(Day14.combine_recipes(3, 7)).toEqual([1, 0]);
        expect(Day14.combine_recipes(2, 3)).toEqual([5]);
        expect(Day14.combine_recipes(0, 0)).toEqual([0]);
    });
    it("works for the examples", () => {
        expect(Day14.part1(9)).toBe("5158916779");
        expect(Day14.part1(5)).toBe("0124515891");
        expect(Day14.part1(18)).toBe("9251071085");
        expect(Day14.part1(2018)).toBe("5941429882");
    });

    it("works for the input", () => {
        expect(Day14.part1(513401)).toBe("5371393113");
    });
});