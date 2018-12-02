defmodule Utils do

  @spec readlines(String.t()) :: [String.t()]
  def readlines(file) do
    File.stream!(file)
      |> Stream.map(&String.trim_trailing/1)
      |> Enum.to_list
  end

  @spec readlines_as_integers(String.t()) :: [integer]
  def readlines_as_integers(file) do
    Utils.readlines(file)
      |> Enum.map(&String.to_integer/1)
  end

  def to_tuples_via_regex(enumerable, regex) do
    enumerable
      |> Enum.map(fn x ->
        # First element in list is full match, skip that
        captures = tl Regex.run(regex, x)
        List.to_tuple captures
      end)
  end

  def intersect_lists(list1, list2) do
    MapSet.intersection(Enum.into(list1, MapSet.new), Enum.into(list2, MapSet.new)) |> MapSet.to_list
  end

  def by_frequency(enumerable) do
    Enum.group_by(enumerable, fn e1 -> Enum.count(enumerable, fn e2 -> e1 == e2 end) end)
      |> Enum.map(fn {k, v} -> {k, hd v} end)
      |> Enum.into(%{})
  end

  defmodule Graph do
    defmodule Edge do
      defstruct from: nil, to: nil, distance: 0
      @type t(from, to) :: %Edge{from: from, to: to, distance: integer}
    end
    defstruct edges: nil

    @type t :: %Graph{edges: [Edge.t]}

    @spec shortest_path(Graph.t, any(), any()) :: integer
    def shortest_path(graph, src, dst) do
      # https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm#Algorithm

      # Distance lookup map, so that we can write vertex_distance[{a, b}]
      # or vertext_distance({b, a})
      vertex_distance = Enum.reduce(graph.edges, %{}, fn edge, acc ->
        Map.put(
          Map.put(acc, {edge.from, edge.to}, edge.distance),
          {edge.to, edge.from}, edge.distance)
      end)
      # Map for finding list of neighbors for vertex v
      neighbors = Enum.reduce(graph.edges, %{}, fn edge, acc ->
        add_to_neighbors(
          add_to_neighbors(acc, edge.from, edge.to),
          edge.to, edge.from)
      end)
      unvisited = Map.keys(neighbors) |> MapSet.new

      unless MapSet.member?(unvisited, src) do raise "#{src} not a known vertex" end
      unless MapSet.member?(unvisited, dst) do raise "#{dst} not a known vertex" end

      best_distance = Enum.reduce(unvisited, %{}, fn v, acc ->
        d = if v == src, do: 0, else: :infinity
        Map.put(acc, v, d)
      end)
      #prev = Enum.reduce(unvisited, %{}, fn v, acc -> Map.put(acc, v, nil) end)

      find(unvisited, best_distance, neighbors, vertex_distance, dst)
    end

    defp find(unvisited, best_distance, neighbors, vertex_distance, dst) do
      # Find the vertext with the smallest distance
      u = hd Enum.sort(unvisited, fn a, b -> best_distance[a] < best_distance[b] end)
      if u == dst do
        # done
        # given prev, can backtrack here to get path
        best_distance[u]
      else
        unvisited_neighbors_of_u = Utils.intersect_lists(neighbors[u], unvisited)
        new_best_distance = Enum.reduce(unvisited_neighbors_of_u, best_distance, fn v, best ->
          alt = best[u] + vertex_distance[{u, v}]
          if alt < best[v], do: Map.put(best, v, alt), else: best
        end)
        find(MapSet.delete(unvisited, u), new_best_distance, neighbors, vertex_distance, dst)
      end
    end

    defp add_to_neighbors(neighbors, a, b) do
      if neighbors[a] == nil do
        Map.put(neighbors, a, [b])
      else
        Map.put(neighbors, a, neighbors[a] ++ [b])
      end
    end
  end
end
