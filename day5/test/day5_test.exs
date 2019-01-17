defmodule Day5Test do
  use ExUnit.Case
  doctest Day5

  test "part1 examples" do
    assert Day5.part1_str("aA") == ""
    assert Day5.part1_str("aAaB") == "aB"
    assert Day5.part1_str("abBA") == ""
    assert Day5.part1_str("abAB") == "abAB"
    assert Day5.part1_str("aabAAB") == "aabAAB"
    assert Day5.part1_str("dabAcCaCBAcCcaDA") == "dabCBAcaDA"
  end

  test "part1" do
    lines = Utils.readlines("input")
    assert Day5.part1(hd lines) == 10132
  end

  test "part2 examples" do
    assert Day5.part2("dabAcCaCBAcCcaDA") == 4
  end

  @tag timeout: 600000
  test "part2" do
    lines = Utils.readlines("input")
    assert Day5.part2(hd lines) == 4572
  end
end
