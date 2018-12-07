defmodule Day7 do
  def part1(instructions) do
    # Each tuple is an edge {from, to}
    edges = instructions
      |> parse_instructions()

    sources = find_starting_points(edges) |> Enum.uniq() |> sort_nodes()
    walk(edges, sources, MapSet.new())
  end

  defp new_worker(step, time) do
    %{:current => step, :time_left => time}
  end

  defp do_work(worker, time) do
    if worker[:current] == nil do
      worker
    else
      %{:current => worker[:current], :time_left => worker[:time_left] - time}
    end
  end

  defp give_step_to_worker(step, time_per_step) do
    new_worker(step, time_per_step[step])
  end

  def part2(instructions, extra_step_time, worker_count) do
    # Each tuple is edge {from, to}
    edges = instructions |> parse_instructions()
    steps = edges |> Enum.flat_map(fn {f, t} -> [f, t] end) |> Enum.uniq()
    time_per_step = steps |> Enum.map(fn s -> {s, time_for(s, extra_step_time)} end) |> Map.new()

    worker_pool = for _ <- 1..worker_count, do: new_worker(nil, 0)

    tick(-1, time_per_step, worker_pool, edges, MapSet.new(), steps)
  end

  def tick(old_time, time_per_step, worker_pool, edges, done, all_steps) do
    this_time = old_time + 1

    # Check workers that are done
    {new_workers, new_done} = worker_pool |> Enum.map_reduce(done, fn w, d ->
      if w[:time_left] == 0 and not is_free(w) do
        step = w[:current]
        nd = MapSet.put(d, step)
        w2 = new_worker(nil, 0)
        {w2, nd}
      else
        {w, d}
      end
    end)

    if all_done(new_done, all_steps) do
      this_time
    else
      # 1. Give work to free workers
      new_workers = assign_work_to_workers(edges, new_done, new_workers, time_per_step)

      # 2. Let workers work
      new_workers = let_workers_work(new_workers)

      tick(this_time, time_per_step, new_workers, edges, new_done, all_steps)
    end
  end

  defp assign_work_to_workers(edges, done, workers, time_per_step) do
    free_count = workers |> Enum.count(&is_free/1)
    pieces_of_work = take_from_queue(edges, done, workers, free_count)

    {busy_workers, _} = workers |> Enum.map_reduce(pieces_of_work, fn w, pieces ->
      if is_free(w) and length(pieces) > 0 do
        [piece | rest] = pieces
        w2 = give_step_to_worker(piece, time_per_step)
        {w2, rest}
      else
        {w, pieces}
      end
    end)
    busy_workers
  end

  defp take_from_queue(edges, done, workers, count) do
    calculate_queue(edges, done, workers) |> Enum.take(count)
  end

  defp calculate_queue(edges, done, workers) do
    queue = all_next_nodes_given_done(edges, done) |> Enum.uniq() |> sort_nodes()
    being_worked_on = workers |> Enum.reject(&is_free/1) |> Enum.map(fn w -> w[:current] end)
    queue -- being_worked_on
  end

  defp let_workers_work(workers) do
    workers |> Enum.map(fn w -> do_work(w, 1) end)
  end

  defp all_done(done_ms, steps_list) do
    Enum.all?(steps_list, fn s -> MapSet.member?(done_ms, s) end)
  end

  defp is_free(worker) do
    worker[:current] == nil
  end

  defp time_for(s, extra) do
    (hd to_charlist(s)) - 64 + extra
  end

  defp walk(edges, queue, done) do
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
      nxt <> walk(edges, new_q, new_done)
    end
  end

  def all_next_nodes_given_done(edges, done) do
    starting_points = find_starting_points(edges)
    next_nodes = edges
      |> Enum.filter(fn {_, t} -> reachable(t, edges, done) end)
      |> Enum.map(fn {_, t} -> t end)
    next_nodes ++ starting_points
      |> Enum.uniq()
      |> Enum.reject(fn n -> MapSet.member?(done, n) end)
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

  defp parse_instructions(instructions) do
    # Step C must be finished before step A can begin.
    Utils.to_tuples_via_regex(instructions, ~r/Step ([A-Za-z]+) .* step ([A-Za-z]+) can.*/)
  end
end
