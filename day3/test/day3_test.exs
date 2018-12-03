defmodule Day3Test do
  use ExUnit.Case
  doctest Day3

  test "part1 examples" do
    p1 = {"1", 1, 3, 4, 4}
    p2 = {"2", 3, 1, 4, 4}
    p3 = {"3", 5, 5, 2, 2}
    assert Day3.part1([p1, p2, p3]) == 4
  end

  test "part1" do
    lines = Utils.readlines("input")
    patches = Utils.to_tuples_via_regex(lines, ~r/#([0-9]+) @ ([0-9]+),([0-9]+): ([0-9]+)x([0-9]+)/)
    numeric = patches |> Enum.map(fn p ->
      {id, l, t, w, h} = p
      {id, String.to_integer(l), String.to_integer(t), String.to_integer(w), String.to_integer(h)}
    end)
    assert Day3.part1(numeric) == 116140
  end

  test "part2 examples" do
    p1 = {"1", 1, 3, 4, 4}
    p2 = {"2", 3, 1, 4, 4}
    p3 = {"3", 5, 5, 2, 2}
    assert Day3.part2([p1, p2, p3]) == ["3"]
  end

  test "part2" do
    lines = Utils.readlines("input")
    patches = Utils.to_tuples_via_regex(lines, ~r/#([0-9]+) @ ([0-9]+),([0-9]+): ([0-9]+)x([0-9]+)/)
    numeric = patches |> Enum.map(fn p ->
      {id, l, t, w, h} = p
      {id, String.to_integer(l), String.to_integer(t), String.to_integer(w), String.to_integer(h)}
    end)
    assert Day3.part2(numeric) == ["574"]
  end
end
