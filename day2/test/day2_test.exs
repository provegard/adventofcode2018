defmodule Day2Test do
  use ExUnit.Case
  doctest Day2

  test "part1_tests" do
    input = [
      "abcdef",
      "bababc",
      "abbcde",
      "abcccd",
      "aabcdd",
      "abcdee",
      "ababab"
    ]
    assert Day2.part1(input) == 12
  end

  test "part1" do
    input = Utils.readlines("input")
    assert Day2.part1(input) == nil
  end

  test "part2_tests" do
    input = [
      "abcde",
      "fghij",
      "klmno",
      "pqrst",
      "fguij",
      "axcye",
      "wvxyz"
    ]
    assert Day2.part2(input) == "fgij"
  end

  test "part2" do
    input = Utils.readlines("input")
    assert Day2.part2(input) == nil
  end
end
