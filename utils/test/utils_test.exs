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

  test "shortest_distance given a single edge" do
    e1 = %Utils.Graph.Edge{from: :foo, to: :bar, distance: 5}
    graph = %Utils.Graph{edges: [e1]}
    assert Utils.Graph.shortest_distance(graph, :foo, :bar) == 5
  end

  test "shortest_distance given multiple edges" do
    e1 = %Utils.Graph.Edge{from: :foo, to: :bar, distance: 5}
    e2 = %Utils.Graph.Edge{from: :bar, to: :qux, distance: 5}
    e3 = %Utils.Graph.Edge{from: :foo, to: :baz, distance: 4}
    e4 = %Utils.Graph.Edge{from: :baz, to: :qux, distance: 5}

    graph = %Utils.Graph{edges: [e1, e2, e3, e4]}
    assert Utils.Graph.shortest_distance(graph, :foo, :qux) == 9 # :foo -> :baz -> :qux
  end

  test "shortest_path given multiple edges" do
    e1 = %Utils.Graph.Edge{from: :foo, to: :bar, distance: 5}
    e2 = %Utils.Graph.Edge{from: :bar, to: :qux, distance: 5}
    e3 = %Utils.Graph.Edge{from: :foo, to: :baz, distance: 4}
    e4 = %Utils.Graph.Edge{from: :baz, to: :qux, distance: 5}

    graph = %Utils.Graph{edges: [e1, e2, e3, e4]}
    assert Utils.Graph.shortest_path(graph, :foo, :qux) == [:foo, :baz, :qux]
  end

  test "shortest_path backwards" do
    e1 = %Utils.Graph.Edge{from: :foo, to: :bar, distance: 5}
    e2 = %Utils.Graph.Edge{from: :bar, to: :qux, distance: 5}

    graph = %Utils.Graph{edges: [e1, e2]}
    assert Utils.Graph.shortest_path(graph, :qux, :foo) == [:qux, :bar, :foo]
  end

  test "shortest_path unknown src" do
    e1 = %Utils.Graph.Edge{from: :foo, to: :bar, distance: 5}

    graph = %Utils.Graph{edges: [e1]}
    assert Utils.Graph.shortest_path(graph, :xx, :bar) == []
  end

  test "shortest_path unknown dst" do
    e1 = %Utils.Graph.Edge{from: :foo, to: :bar, distance: 5}

    graph = %Utils.Graph{edges: [e1]}
    assert Utils.Graph.shortest_path(graph, :foo, :xx) == []
  end

  test "shortest_path middle" do
    e1 = %Utils.Graph.Edge{from: :foo, to: :bar, distance: 5}
    e2 = %Utils.Graph.Edge{from: :bar, to: :qux, distance: 5}
    e3 = %Utils.Graph.Edge{from: :qux, to: :quux, distance: 5}

    graph = %Utils.Graph{edges: [e1, e2, e3]}
    assert Utils.Graph.shortest_path(graph, :quux, :bar) == [:quux, :qux, :bar]
  end

  test "shortest_path disconnected" do
    e1 = %Utils.Graph.Edge{from: :foo, to: :bar, distance: 5}
    e2 = %Utils.Graph.Edge{from: :baz, to: :qux, distance: 5}

    graph = %Utils.Graph{edges: [e1, e2]}
    assert Utils.Graph.shortest_path(graph, :foo, :bar) == [:foo, :bar]
  end

  test "shortest_path disconnected no path" do
    edges = [
      %Utils.Graph.Edge{distance: 1, from: :a, to: :b},
      %Utils.Graph.Edge{distance: 1, from: :c, to: :d},
    ]
    graph = %Utils.Graph{edges: edges}
    assert Utils.Graph.shortest_path(graph, :a, :c) == []
  end

  test "shortest_path given unreachable destination" do
    e1 = %Utils.Graph.Edge{from: :foo, to: :bar, distance: 5}
    e2 = %Utils.Graph.Edge{from: :baz, to: :qux, distance: 5}
    graph = %Utils.Graph{edges: [e1, e2]}
    assert Utils.Graph.shortest_path(graph, :foo, :qux) == []
  end

  test "shortest_paths with multiple destinations" do
    edges = [
      %Utils.Graph.Edge{from: :a, to: :b, distance: 5},
      %Utils.Graph.Edge{from: :a, to: :c, distance: 5}
    ]
    graph = %Utils.Graph{edges: edges}
    assert Utils.Graph.shortest_paths(graph, :a, [:b, :c]) == %{
      :b => [:a, :b],
      :c => [:a, :c]
    }
  end

  test "shortest_paths with multiple destinations 2" do
    edges = [
      %Utils.Graph.Edge{from: :a, to: :b, distance: 5},
      %Utils.Graph.Edge{from: :b, to: :c, distance: 5}
    ]
    graph = %Utils.Graph{edges: edges}
    assert Utils.Graph.shortest_paths(graph, :a, [:b, :c]) == %{
      :b => [:a, :b],
      :c => [:a, :b, :c]
    }
  end

  test "shortest_distance given unreachable destination" do
    e1 = %Utils.Graph.Edge{from: :foo, to: :bar, distance: 5}
    e2 = %Utils.Graph.Edge{from: :baz, to: :qux, distance: 5}
    graph = %Utils.Graph{edges: [e1, e2]}
    assert Utils.Graph.shortest_distance(graph, :foo, :qux) == :infinity
  end
end
