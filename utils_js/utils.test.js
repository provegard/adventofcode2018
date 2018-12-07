const utils = require("./utils");

//testing

describe("utils", () => {
    describe("readLines", () => {
        it("works", () => {
            const lines = utils.readLines("utils.test.js");
            expect(lines).toContain("//testing");
        });
    });

    describe("flatMap", () => {
        it("maps flatly", () => {
            const arr = [1, 2, 3];
            const result = utils.flatMap(arr, (e) => [e, e]);
            expect(result).toEqual([1, 1, 2, 2, 3, 3]);
        });
    });

    describe("zip", () => {
        it("zips", () => {
            const arr1 = [1, 2, 3];
            const arr2 = [4, 5, 6];
            const result = utils.zip(arr1, arr2);
            expect(result).toEqual([[1, 4], [2, 5], [3, 6]]);
        });

        it("uses the shortest arrya", () => {
            const arr1 = [1, 2, 3];
            const arr2 = [4, 5];
            const result = utils.zip(arr1, arr2);
            expect(result).toEqual([[1, 4], [2, 5]]);
        });
    });

    describe("zipWithIndex", () => {
        it("zips", () => {
            const arr = [1, 2, 3];
            const result = utils.zipWithIndex(arr);
            expect(result).toEqual([[1, 0], [2, 1], [3, 2]]);
        });
    });
});