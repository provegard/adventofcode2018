defmodule Day11Test do
  use ExUnit.Case
  doctest Day11

  test "power level" do
    assert Day11.power_level(3, 5, 8) == 4
    assert Day11.power_level(122, 79, 57) == -5
    assert Day11.power_level(217, 196, 39) == 0
    assert Day11.power_level(101, 153, 71) == 4
  end

  test "part 1 examples" do
    assert Day11.part1(18) == {33, 45, 29}
    assert Day11.part1(42) == {21, 61, 30}
  end

  test "part 1" do
    assert Day11.part1(2694) == {243, 38, 30}
  end

  @tag timeout: 3600000
  test "part 2 examples" do
    assert Day11.part2(18) == {90, 269, 16, 113}
    assert Day11.part1(42) == {232, 251, 12, 119}
  end

  @tag timeout: 3600000
  test "part 2" do
    assert Day11.part2(2694) == {235, 146, 13, 96}
  end
end
