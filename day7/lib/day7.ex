defmodule Day7 do
  def part1(instructions) do
    # Each tuple is an edge {from, to}
    edges = instructions
      |> parse_instructions()

    sources = find_starting_points(edges) |> Enum.uniq() |> sort_nodes()
    walk(edges, sources, MapSet.new())
  end

  defmodule Worker do
    defstruct current: nil, time_left: 0

    def waiting(), do: %Worker{}
    def work(%Worker{time_left: 0} = w), do: w
    def work(%Worker{time_left: t} = w), do:
        %{w | time_left: t - 1}
    def collect(%Worker{current: nil} = w), do: w
    def collect(%Worker{current: c}), do: {Worker.waiting(), c}
    def start_working(step, time), do: %Worker{current: step, time_left: time}
    def free?(w), do: w.current == nil
    def done?(w), do: w.time_left == 0
  end

  def part2(instructions, extra_step_time, worker_count) do
    # Each tuple is edge {from, to}
    edges = instructions |> parse_instructions()
    steps = edges |> Enum.flat_map(fn {f, t} -> [f, t] end) |> Enum.uniq()
    time_per_step = steps |> Enum.map(fn s -> {s, time_for(s, extra_step_time)} end) |> Map.new()

    workers = for _ <- 1..worker_count, do: Worker.waiting()
    worker_factory = &(Worker.start_working(&1, time_per_step[&1]))
    is_done = &(all_done?(&1, steps))

    tick(-1, workers, worker_factory, edges, MapSet.new(), is_done)
  end

  def tick(old_time, workers, worker_factory, edges, done, is_done?) do
    this_time = old_time + 1

    # Check workers that are done
    {workers_, done_} = workers |> collect_done_steps(done)

    # Have all steps been completed?
    if is_done?.(done_) do
      this_time
    else
      # Work work work!
      workers__ = workers_
        |> assign_work(edges, done_, worker_factory)
        |> let_workers_work()

      # Advance time
      tick(this_time, workers__, worker_factory, edges, done_, is_done?)
    end
  end

  defp collect_done_steps(workers, done) do
    workers |> Enum.map_reduce(done, fn w, d ->
      if Worker.done?(w) and not Worker.free?(w) do
        {w_, done_step} = Worker.collect(w)
        {w_, MapSet.put(d, done_step)}
      else
        {w, d}
      end
    end)
  end

  defp assign_work(workers, edges, done, worker_factory) do
    next_steps = workers
      |> Enum.count(&(Worker.free?/1))
      |> take_steps(workers, edges, done)

    {busy_workers, _} = workers
      |> Enum.map_reduce(next_steps, fn w, steps ->
        if Worker.free?(w) and length(steps) > 0 do
          [step | rest] = steps
          {worker_factory.(step), rest}
        else
          {w, steps}
        end
      end)
    busy_workers
  end

  defp take_steps(count, workers, edges, done) do
    available_steps(workers, edges, done) |> Enum.take(count)
  end

  defp available_steps(workers, edges, done) do
    queue = all_next_nodes_given_done(edges, done) |> Enum.uniq() |> sort_nodes()
    being_worked_on = workers |> Enum.reject(&(Worker.free?/1)) |> Enum.map(fn w -> w.current end)
    queue -- being_worked_on
  end

  defp let_workers_work(workers), do: workers |> Enum.map(&(Worker.work/1))

  defp all_done?(done_ms, steps_list) do
    Enum.all?(steps_list, fn s -> MapSet.member?(done_ms, s) end)
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
