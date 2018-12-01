defmodule UtilsTest do
  use ExUnit.Case
  doctest Utils

  test "readlines reads lines, stripping whitespace" do
    lines = Utils.readlines("test/lines.txt")
    assert lines == ["1", "2", "3"]
  end

  test "readlines_as_integers reads lines, converting to integers" do
    lines = Utils.readlines_as_integers("test/lines.txt")
    assert lines == [1, 2, 3]
  end

  test "to_tuples_via_regex" do
    assert Utils.to_tuples_via_regex(["a,c", "d,e"], ~r/(.*),(.*)/) == [{"a", "c"}, {"d", "e"}]
  end

  test "intersect_lists" do
    assert Utils.intersect_lists([1, 2, 3], [2, 3, 4]) == [2, 3]
    assert Utils.intersect_lists([1, 2, 3], [4, 5, 6]) == []
  end

  test "shortest_path given a single edge" do
    e1 = %Utils.Graph.Edge{from: :foo, to: :bar, distance: 5}
    graph = %Utils.Graph{edges: [e1]}
    assert Utils.Graph.shortest_path(graph, :foo, :bar) == 5
  end

  test "shortest_path given multiple edges" do
    e1 = %Utils.Graph.Edge{from: :foo, to: :bar, distance: 5}
    e2 = %Utils.Graph.Edge{from: :bar, to: :qux, distance: 5}
    e3 = %Utils.Graph.Edge{from: :foo, to: :baz, distance: 4}
    e4 = %Utils.Graph.Edge{from: :baz, to: :qux, distance: 5}

    graph = %Utils.Graph{edges: [e1, e2, e3, e4]}
    assert Utils.Graph.shortest_path(graph, :foo, :qux) == 9 # :foo -> :baz -> :qux
  end
end
