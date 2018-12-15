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
    units = Cave.units(cave)
    new_cave = Day15.unit_turn(units, {1, 1}, cave.map[{1, 1}], cave)

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
    units = Cave.units(cave)
    new_cave = Day15.unit_turn(units, {2, 1}, cave.map[{2, 1}], cave)

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

  test "part 1" do
    lines = Utils.readlines("input")
    assert Day15.part1(lines) == 207542
  end
end
