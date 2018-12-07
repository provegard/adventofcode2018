defmodule Day7Test do
  use ExUnit.Case
  doctest Day7

  test "part1 examples" do
    instructions = [
      "Step C must be finished before step A can begin.",
      "Step C must be finished before step F can begin.",
      "Step A must be finished before step B can begin.",
      "Step A must be finished before step D can begin.",
      "Step B must be finished before step E can begin.",
      "Step D must be finished before step E can begin.",
      "Step F must be finished before step E can begin."
    ]
    assert Day7.part1(instructions) == "CABDFE"
  end

  test "part1" do
    instructions = Utils.readlines("input")
    assert Day7.part1(instructions) == nil
  end
end
