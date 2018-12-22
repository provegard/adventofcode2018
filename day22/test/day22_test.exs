defmodule Day22Test do
  use ExUnit.Case
  doctest Day22

  test "works for the example" do
    assert Day22.part1(510, {10, 10}) == 114
  end

  test "works for the input" do
    assert Day22.part1(3879, {8, 713}) == 6323
  end
end
