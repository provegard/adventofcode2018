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
    assert Day7.part1(instructions) == "BFKEGNOVATIHXYZRMCJDLSUPWQ"
  end

  test "part 2 base case 1" do
    instructions = [
      "Step C must be finished before step A can begin."
    ]
    assert Day7.part2(instructions, 0, 1) == 4
    assert Day7.part2(instructions, 0, 2) == 4
  end

  test "part 2 base case 2" do
    instructions = [
      "Step C must be finished before step A can begin.",
      "Step B must be finished before step A can begin."
    ]
    assert Day7.part2(instructions, 0, 1) == 6 # BBCCCA
    assert Day7.part2(instructions, 0, 2) == 4 # (B/C)(B/C)(./C)(A)
  end

  test "part 2 examples" do
    instructions = [
      "Step C must be finished before step A can begin.",
      "Step C must be finished before step F can begin.",
      "Step A must be finished before step B can begin.",
      "Step A must be finished before step D can begin.",
      "Step B must be finished before step E can begin.",
      "Step D must be finished before step E can begin.",
      "Step F must be finished before step E can begin."
    ]
    assert Day7.part2(instructions, 0, 2) == 15
  end

  test "part2" do
    instructions = Utils.readlines("input")
    assert Day7.part2(instructions, 60, 5) == 1020
  end

  test "all_next_nodes_given_done" do
    assert Day7.all_next_nodes_given_done([{"A", "B"}], MapSet.new()) == ["A"]
    assert Day7.all_next_nodes_given_done([{"A", "B"}], MapSet.new(["A"])) == ["B"]

    assert Day7.all_next_nodes_given_done([{"B", "A"}, {"C", "A"}], MapSet.new(["B"])) == ["C"]
    assert Day7.all_next_nodes_given_done([{"B", "A"}, {"C", "A"}], MapSet.new(["B", "C"])) == ["A"]
  end
end
