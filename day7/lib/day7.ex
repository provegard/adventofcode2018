defmodule Day7 do
  def part1(instructions) do
    # Each tuple is an edge {from, to}
    edges = instructions
      |> parse_instructions()
      #|> Enum.map(fn {f, t} -> %{ }} end)
    #graph = %Utils.Graph{edges: edges}

    sources = find_starting_points(edges) |> Enum.uniq() |> sort_nodes()
    dst = find_dst(edges)
    walk(dst, edges, sources, MapSet.new())
  end

  defp walk(dst, edges, queue, done) do
    if length(queue) == 0 do
      # Nothing more in the queue, so we're done
      ""
    else
      # Take the next from the queue, assume sorted
      [nxt | rest] = queue
      # Create a new 'done' set, to be able to test reachability
      new_done = MapSet.put(done, nxt)
      # Find all next nodes, sort the new queue
      new_q = rest ++ all_next_nodes(nxt, edges, new_done) |> sort_nodes()
      # Emit 'nxt' and recurse
      nxt <> walk(dst, edges, new_q, new_done)
    end
  end

  defp all_next_nodes(node, edges, done) do
    edges
      |> Enum.filter(fn {f, t} -> f == node and reachable(t, edges, done) end)
      |> Enum.map(fn {_, t} -> t end)
  end

  defp reachable(node, edges, done) do
    edges
      |> Enum.filter(fn {_, t} -> t == node end)
      |> Enum.all?(fn {f, _} -> MapSet.member?(done, f) end)
  end

  defp sort_nodes(nodes) do
    nodes |> Enum.sort(fn t1, t2 -> value(t1) < value(t2) end)
  end

  defp value(node) do
    hd to_charlist(node)
  end

  defp find_starting_points(edges) do
    all_destinations = edges |> Enum.map(fn {_, t} -> t end) |> MapSet.new()
    edges
      |> Enum.filter(fn {f, _} -> not MapSet.member?(all_destinations, f) end)
      |> Enum.map(fn {f, _} -> f end)
  end

  defp find_dst(edges) do
    all_from = edges |> Enum.map(fn {f, _} -> f end) |> MapSet.new()
    {_, to} = Enum.find(edges, fn {_, t} -> not MapSet.member?(all_from, t) end)
    to
  end

  defp parse_instructions(instructions) do
    # Step C must be finished before step A can begin.
    Utils.to_tuples_via_regex(instructions, ~r/Step ([A-Za-z]+) .* step ([A-Za-z]+) can.*/)
  end
end
