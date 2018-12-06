defmodule Day6Test do
  use ExUnit.Case
  doctest Day6

  test "part 1 examples" do
    input = [
      {1, 1},
      {1, 6},
      {8, 3},
      {3, 4},
      {5, 5},
      {8, 9}
    ]
    assert Day6.part1(input) == 17
  end

  test "part 1" do
    tuples = Utils.readlines("input")
      |> Utils.to_tuples_via_regex(~r/([0-9]+), ([0-9]+)/)
      |> Enum.map(fn {s1, s2} -> {String.to_integer(s1), String.to_integer(s2)} end)
    assert Day6.part1(tuples) == 4011
  end
end
