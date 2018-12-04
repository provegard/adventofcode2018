defmodule Day4 do

  defmodule Record do
    defstruct timestamp: nil, guard_id: nil, action: nil

    def parse(s) do
      tup = hd Utils.to_tuples_via_regex([s], ~r/\[(.*)\] (Guard|falls|wakes+) #?([^ ]+).*/)
      # Convert to NaiveDateTime-parseable string
      dt_iso = String.replace(elem(tup, 0), " ", "T") <> ":00"
      action = cond do
        elem(tup, 1) == "Guard" -> :new_guard
        elem(tup, 1) == "falls" -> :falls_asleep
        true                    -> :wakes_up
      end
      %Record{timestamp: NaiveDateTime.from_iso8601!(dt_iso), guard_id: elem(tup, 2), action: action}
    end
  end

  defmodule Guard do
    defstruct id: 0, minutes_asleep: []

    def new(id) do
      %Guard{id: id, minutes_asleep: []}
    end

    def with_minutes(guard, minutes) do
      %Guard{id: guard.id, minutes_asleep: guard.minutes_asleep ++ minutes}
    end

    def most_frequent_sleep_minute(guard) do
      Utils.by_frequency(guard.minutes_asleep)
        |> Enum.max_by(fn {k, _} -> k end)
        |> elem(1)
    end
  end

  def part1(lines) do
    slept_the_most = lines
      |> parse_lines()
      |> arrange_guards_by_id()
      |> Enum.max_by(fn {_, g} -> length(g.minutes_asleep) end)
      |> elem(1)

    slept_the_most.id * Guard.most_frequent_sleep_minute(slept_the_most)
  end

  def part2(lines) do
    # Create tuples of {guard_id, minute}
    tuples = lines
      |> parse_lines()
      |> arrange_guards_by_id()
      |> Enum.flat_map(fn {_, g} -> g.minutes_asleep |> Enum.map(fn m -> {g.id, m} end) end)

    # Group by frequency and find the tuple with the highest frequency
    {id, m} = tuples
      |> Utils.by_frequency
      |> Enum.max_by(fn {k, _} -> k end)
      |> elem(1)

    id * m
  end

  defp arrange_guards_by_id(sorted_records) do
    {_, _, guard_by_id} = Enum.reduce(sorted_records, {nil, nil, %{}}, &track/2)
    guard_by_id
  end

  defp parse_lines(lines) do
    lines
      |> Enum.map(fn line -> Record.parse(line) end)
      |> Enum.sort(fn a, b -> NaiveDateTime.compare(a.timestamp, b.timestamp) == :lt end)
  end

  defp track(record, {current_guard_id, sleep_minute, guard_by_id}) do
    cond do
      record.action == :new_guard ->
        guard = guard_by_id[record.guard_id]
        gbi = if guard == nil, do: Map.put(guard_by_id, record.guard_id, Guard.new(String.to_integer(record.guard_id))), else: guard_by_id
        {record.guard_id, nil, gbi}

      record.action == :falls_asleep ->
        {current_guard_id, record.timestamp.minute, guard_by_id}

      record.action == :wakes_up ->
        minutes_slept = Enum.to_list sleep_minute..(record.timestamp.minute - 1)
        guard = guard_by_id[current_guard_id]
        if guard == nil, do: raise "No guard with ID #{current_guard_id}"
        new_guard = Guard.with_minutes(guard, minutes_slept)
        gbi = Map.put(guard_by_id, current_guard_id, new_guard)
        {current_guard_id, nil, gbi}
    end
  end
end
