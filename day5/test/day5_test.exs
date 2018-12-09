defmodule Day5Test do
  use ExUnit.Case
  doctest Day5

  test "find_regions_to_delete" do
    assert Day5.find_regions_to_delete('aA') == [{0, 1}]
    assert Day5.find_regions_to_delete('caA') == [{1, 2}]
    assert Day5.find_regions_to_delete('aAaB') == [{0, 1}]
    assert Day5.find_regions_to_delete('abBA') == [{0, 3}]
    assert Day5.find_regions_to_delete('aAbAaBc') == [{0, 1}, {2, 5}]
    assert Day5.find_regions_to_delete('aabbcc') == []
  end

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
    #lines = Utils.readlines("input")
    #assert Day5.part2(hd lines) == 4572
  end
end
