const utils = require("../utils_js/utils");
const main = require("./main");

describe("part1", () => {
    it("can parse", () => {
        const line = "17 units each with 5390 hit points (weak to radiation, bludgeoning) with an attack that does 4507 fire damage at initiative 2";
        const g = main.Group.parse("x", "immune", line);
        expect(g.type).toBe("immune");
        expect(g.unitCount).toBe(17);
        expect(g.hitPoints).toBe(5390);
        expect(g.initiative).toBe(2);
        expect(Array.from(g.weaknesses)).toEqual(["radiation", "bludgeoning"]);
        expect(Array.from(g.immunities)).toEqual([]);
        expect(g.attackDamage).toBe(4507);
        expect(g.attackType).toBe("fire");
    });

    it("works for the example", () => {
        const lines = utils.readLines("example");
        expect(main.part1(lines)).toBe(5216);
    });

    it("works for the input", () => {
        const lines = utils.readLines("input");
        expect(main.part1(lines)).toBe(18346);
    });
});