const utils = require("../utils_js/utils");
const main = require("./main");

describe("part1", () => {
    it("finds sub paths", () => {
        expect(main.subPaths("NEEE|SSE(EE|N))W")).toEqual([
            "NEEEW",
            "SSE(EE|N)W"
        ]);
    });
    it("works for the examples", () => {
        expect(main.part1("^WNE$")).toBe(3);
        expect(main.part1("^ENWWW(NEEE|SSE(EE|N))$")).toBe(10);
        expect(main.part1("^ENNWSWW(NEWS|)SSSEEN(WNSE|)EE(SWEN|)NNN$")).toBe(18);
        expect(main.part1("^ESSWWN(E|NNENN(EESS(WNSE|)SSS|WWWSSSSE(SW|NNNE)))$")).toBe(23);
        expect(main.part1("^WSSEESWWWNW(S|NENNEEEENN(ESSSSW(NWSW|SSEN)|WSWWN(E|WWS(E|SS))))$")).toBe(31);
    });

    it("works for the input", () => {
        const lines = utils.readLines("input");
        const regex = lines[0];
        expect(main.part1(regex)).toBe(3476);
    });
});