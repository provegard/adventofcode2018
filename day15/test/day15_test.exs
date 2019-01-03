defmodule Day15Test do
  use ExUnit.Case
  doctest Day15

  test "units" do
    lines = [
      "#######",
      "#E..G.#",
      "#...#.#",
      "#.G.#G#",
      "#######"
    ]
    cave = Cave.parse(lines)
    units = Cave.units(cave)
    assert (hd units) == {{1, 1}, %Unit{type: :elf}}
  end

  test "unit_turn" do
    lines = [
      "#######",
      "#E..G.#",
      "#...#.#",
      "#.G.#G#",
      "#######"
    ]
    cave = Cave.parse(lines)
    new_cave = Day15.unit_turn({1, 1}, cave.map[{1, 1}], cave, false)

    assert new_cave.map[{1, 1}] == :open
    assert new_cave.map[{2, 1}] == %Unit{type: :elf}
  end

  test "unit_turn, multiple paths" do
    lines = [
      "#######",
      "#.E...#",
      "#.....#",
      "#...G.#",
      "#######"
    ]
    cave = Cave.parse(lines)
    new_cave = Day15.unit_turn({2, 1}, cave.map[{2, 1}], cave, false)

    assert new_cave.map[{2, 1}] == :open
    assert new_cave.map[{3, 1}] == %Unit{type: :elf}
  end

  test "part 1 example" do
    lines = [
      "#######",
      "#.G...#",
      "#...EG#",
      "#.#.#G#",
      "#..G#E#",
      "#.....#",
      "#######"
    ]
    assert Day15.part1(lines) == 27730
  end

  test "part 2 example 1" do
    lines = [
      "#######",
      "#.G...#",
      "#...EG#",
      "#.#.#G#",
      "#..G#E#",
      "#.....#",
      "#######"
    ]
    assert Day15.part2(lines) == {15, 4988}
  end

  test "part 2 example 2" do
    lines = [
      "#######",
      "#E..EG#",
      "#.#G.E#",
      "#E.##E#",
      "#G..#.#",
      "#..E#.#",
      "#######"
    ]
    assert Day15.part2(lines) == {4, 31284}
  end

  @tag :focus
  test "part 1" do
    lines = Utils.readlines("input")
    assert Day15.part1(lines) == 207542
  end

  @tag :focus
  test "part 1, Anders" do
    lines = Utils.readlines("anders_input")
    assert Day15.part1(lines) == 206236
  end

  @tag timeout: 600000
  test "part 2" do
    lines = Utils.readlines("input")
    assert Day15.part2(lines) == {16, 64688}
  end
end
