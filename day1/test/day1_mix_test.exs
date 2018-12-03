defmodule Day1MixTest do
  use ExUnit.Case
  doctest Day1Mix

  test "part1 test cases" do
    assert Day1Mix.part1([+1, -2, +3, +1]) == 3
    assert Day1Mix.part1([-1, -2, -3]) == -6
  end

  test "part1" do
    numbers = Utils.readlines_as_integers("input")
    assert Day1Mix.part1(numbers) == 435
  end

  test "part2 test cases" do
    assert Day1Mix.part2([+1, -2, +3, +1]) == 2
    assert Day1Mix.part2([+1, -1]) == 0
    assert Day1Mix.part2([+3, +3, +4, -2, -4]) == 10
  end

  test "part2" do
    numbers = Utils.readlines_as_integers("input")
    assert Day1Mix.part2(numbers) == 245
  end
end
