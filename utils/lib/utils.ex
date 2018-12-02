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

  @doc ~S"""
  Converts an enumerable of string to an enumerable of tuples based on
  capturing groups in a regular expression. Note that the entire match will
  not be part of the tuple.

  ## Examples

      iex> Utils.to_tuples_via_regex(["a,c", "d,e"], ~r/(.*),(.*)/)
      [{"a", "c"}, {"d", "e"}]

  """
  def to_tuples_via_regex(enumerable, regex) do
    enumerable
      |> Enum.map(fn x ->
        # First element in list is full match, skip that
        captures = tl Regex.run(regex, x)
        List.to_tuple captures
      end)
  end


  @doc ~S"""
  Intersects two lists. Multiple elements are only returned once. Order is undefined.

  ## Examples

      iex> Utils.intersect_lists([1, 2, 3], [2, 3, 4])
      [2, 3]

      iex> Utils.intersect_lists([1, 2, 3], [4, 5, 6])
      []

  """
  def intersect_lists(list1, list2) do
    MapSet.intersection(Enum.into(list1, MapSet.new), Enum.into(list2, MapSet.new)) |> MapSet.to_list
  end

  @doc ~S"""
  Groups by frequency. Frequencies become keys in the returned map.

  ## Examples

      iex> Utils.by_frequency('abbccc')
      %{1 => ?a, 2 => ?b, 3 => ?c}

  """
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
    @type vertex :: any()

    @spec shortest_distance(t, vertex, vertex) :: integer
    def shortest_distance(graph, src, dst) do
      {dist, _} = shortest(graph, src, dst)
      dist
    end

    @spec shortest_path(t, vertex, vertex) :: [vertex]
    def shortest_path(graph, src, dst) do
      {_, path} = shortest(graph, src, dst)
      path
    end

    @spec shortest(t, vertex, vertex) :: {integer, [vertex]}
    defp shortest(graph, src, dst) do
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
      prev = %{}
      #prev = Enum.reduce(unvisited, %{}, fn v, acc -> Map.put(acc, v, nil) end)

      find_path(unvisited, best_distance, neighbors, vertex_distance, prev, src, dst)
    end

    defp find_path(unvisited, best_distance, neighbors, vertex_distance, current_prev, src, dst) do
      # Find the vertext with the smallest distance
      u = hd Enum.sort(unvisited, fn a, b -> best_distance[a] < best_distance[b] end)
      if u == dst do
        # done
        # given prev, can backtrack here to get path
        {best_distance[u], backtrack(src, dst, current_prev)}
      else
        unvisited_neighbors_of_u = Utils.intersect_lists(neighbors[u], unvisited)
        {new_best_distance, new_prev} = Enum.reduce(unvisited_neighbors_of_u, {best_distance, current_prev}, fn v, {best, prev} ->
          alt = best[u] + vertex_distance[{u, v}]
          if alt < best[v], do: {Map.put(best, v, alt), Map.put(prev, v, u)}, else: {best, prev}
        end)
        find_path(MapSet.delete(unvisited, u), new_best_distance, neighbors, vertex_distance, new_prev, src, dst)
      end
    end

    @spec backtrack(vertex, vertex, Map.t) :: [vertex]
    defp backtrack(src, cur, prev) do
      cond do
        cur == nil       -> []
        src == cur       -> [cur]
        prev[cur] == nil -> []
        true             -> backtrack(src, prev[cur], prev) ++ [cur]
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
