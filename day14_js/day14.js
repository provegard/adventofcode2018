const utils = require("../utils_js/utils");
const Iterator = utils.Iterator;

function part1(count) {
    const recipes = [3, 7];
    iter(recipes, 0, 1, count + 10);
    const relevant = recipes.slice(count, count + 10);
    return relevant.join("");
}

function part2(lines) {
}

function iter(recipes, e1, e2, count) {
    // starting point: recipes == [3, 7]
    while (recipes.length < count) {
        const r1 = recipes[e1];
        const r2 = recipes[e2];
        const comb = combine_recipes(r1, r2);
        recipes.push(...comb);
        e1 = next(recipes, e1, r1);
        e2 = next(recipes, e2, r2);
    }
}

function next(recipes, e, r) {
    return (e + 1 + r) % recipes.length;
}

function combine_recipes(a, b) {
    const sum = a + b;
    return Array.from(digits(sum)).reverse();

    function *digits(n) {
        do {
            yield n % 10;
            n = Math.floor(n / 10);
        } while (n > 0);
    }
}

module.exports = { part1, part2, combine_recipes };
