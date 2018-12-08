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

    describe("range", () => {
        it("by default emits 0", () => {
            const arr = Array.from(utils.range());
            expect(arr).toEqual([0]);
        });

        it("can emit a range", () => {
            const arr = Array.from(utils.range(1, 5));
            expect(arr).toEqual([1, 2, 3, 4]);
        });
    });

    describe("Iterator", () => {
        const Iterator = utils.Iterator;
        describe("map", () => {
            it("can map", () => {
                const square = (x) => x * x;
                const result = Iterator.map(square, utils.range(0, 4));
                expect(Array.from(result)).toEqual([0, 1, 4, 9]);
            });
        });

        describe("flatMap", () => {
            it("can map flatly", () => {
                const repeat = (x) => [x, x];
                const result = Iterator.flatMap(repeat, utils.range(0, 3));
                expect(Array.from(result)).toEqual([0, 0, 1, 1, 2, 2]);
            });
        });

        describe("filter", () => {
            it("can filter", () => {
                const isEven = (x) => x % 2 == 0;
                const result = Iterator.filter(isEven, utils.range(0, 5));
                expect(Array.from(result)).toEqual([0, 2, 4]);
            });
        });

        describe("reject", () => {
            it("can reject", () => {
                const isEven = (x) => x % 2 == 0;
                const result = Iterator.reject(isEven, utils.range(0, 5));
                expect(Array.from(result)).toEqual([1, 3]);
            });
        });
    });
});