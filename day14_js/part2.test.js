const utils = require("../utils_js/utils");
const Day14 = require("./day14");

describe("part2", () => {
    it("works for the example", () => {
        expect(Day14.part2("51589")).toBe(9);
        expect(Day14.part2("01245")).toBe(5);
        expect(Day14.part2("92510")).toBe(18);
        expect(Day14.part2("59414")).toBe(2018);
    });
    it("works for the input", () => {
        // test suite running time: 71.585s
        expect(Day14.part2("513401")).toBe(20286858);
    });
});