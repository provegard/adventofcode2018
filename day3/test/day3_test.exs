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
    assert Day3.part1(read_patches()) == 116140
  end

  test "part2 examples" do
    p1 = {"1", 1, 3, 4, 4}
    p2 = {"2", 3, 1, 4, 4}
    p3 = {"3", 5, 5, 2, 2}
    assert Day3.part2([p1, p2, p3]) == ["3"]
  end

  test "part2" do
    assert Day3.part2(read_patches()) == ["574"]
  end

  defp read_patches do
    lines = Utils.readlines("input")
    patches = Utils.to_tuples_via_regex(lines, ~r/#([0-9]+) @ ([0-9]+),([0-9]+): ([0-9]+)x([0-9]+)/)
    patches |> Enum.map(fn p ->
      {id, l, t, w, h} = p
      {id, String.to_integer(l), String.to_integer(t), String.to_integer(w), String.to_integer(h)}
    end)
  end
end
