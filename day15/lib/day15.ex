defmodule Unit do
  defstruct type: nil, hit_points: 200, attack_power: 3, id: nil

  def new(type, attack_power, id), do: %Unit{type: type, attack_power: attack_power, id: id}
  def take_hit_from(unit, attacker), do: %Unit{unit | hit_points: unit.hit_points - attacker.attack_power}
  def is_dead?(unit), do: unit.hit_points <= 0
  def is?(%Unit{type: type}, requested), do: type == requested
  def is?(_, _), do: false
end

defmodule Cave do
  import Astar
  defstruct map: nil, stuck_positions: nil

  def unit_id_at(cave, pos) do
    at_pos = cave.map[pos]
    cond do
      Unit.is?(at_pos, :elf) -> at_pos.id
      Unit.is?(at_pos, :goblin) -> at_pos.id
      true -> -1
    end
  end

  def parse(lines, elf_attack_power \\ 3) do
    map = lines |> Enum.with_index() |> Enum.reduce(%{}, fn {line, y}, map ->
      String.to_charlist(line) |> Enum.with_index() |> Enum.reduce(map, fn {chr, x}, map ->
        pos = {x, y}
        id = 7919 * y + x
        at_pos = cond do
          chr == (hd '#') -> nil # :wall
          chr == (hd '.') -> :open
          chr == (hd 'E') -> Unit.new(:elf, elf_attack_power, id)
          chr == (hd 'G') -> Unit.new(:goblin, 3, id)
          true            -> raise "Unknown: #{chr}"
        end
        if at_pos == nil, do: map, else: Map.put(map, pos, at_pos)
      end)
    end)
    %Cave{map: map, stuck_positions: MapSet.new()}
  end

  def remember_stuck_at(%Cave{stuck_positions: s} = cave, pos) do
    %Cave{cave | stuck_positions: MapSet.put(s, pos)}
  end

  def is_position_stuck?(%Cave{stuck_positions: s}, pos), do: MapSet.member?(s, pos)

  def sum_hit_points(cave) do
    units(cave) |> Enum.reduce(0, fn {_, unit}, sum -> sum + unit.hit_points end)
  end

  def units(%Cave{map: map}) do
    map
      |> Enum.filter(fn {_, unit} -> Unit.is?(unit, :elf) or Unit.is?(unit, :goblin) end)
      |> Enum.sort(fn {p1, _}, {p2, _} -> Day15.is_less_in_reading_order?(p1, p2) end)
  end

  def shortest_path(%Cave{map: map} = cave, src, dst) do
    at_dst = map[dst]
    if at_dst != :open, do: raise "Impossible destination: #{inspect at_dst}"

    nbs = fn pos -> open_positions_adjacent_to_position(cave, pos) end
    dist = fn _, _ -> 1 end
    h = fn a, b -> manhattan_distance(a, b) end
    env = {nbs, dist, h}

    paths = open_positions_adjacent_to_position(cave, src)
      |> Enum.map(fn pos ->
        if pos == dst do
          [pos]
        else
          path = astar(env, pos, dst)
          if length(path) == 0, do: [], else: [pos | path]
        end
      end)
      |> Enum.reject(fn path -> length(path) == 0 end)
    if length(paths) == 0 do
      []
    else
      Enum.min_by(paths, fn path -> length(path) end)
    end
  end

  defp manhattan_distance({x1, y1}, {x2, y2}), do: abs(x1 - x2) + abs(y1 - y2)
  def are_positions_adjacent?(a, b), do: manhattan_distance(a, b) == 1

  def open_positions_adjacent_to_position(%Cave{map: map}, {x, y}) do
    [{x, y-1}, {x-1, y}, {x+1, y}, {x, y+1}] |> Enum.filter(fn p -> map[p] == :open end)
  end

  def move(cave, from, to) do
    cave_map = cave.map
    at_from = cave_map[from]
    at_to = cave_map[to]
    cond do
      #at_from == :wall -> raise "cannot move a wall at #{inspect from}"
      at_from == nil -> raise "cannot move a wall at #{inspect from}"
      at_from == :open -> raise "nothing to move at #{inspect from}"
      at_to != :open -> raise "#{inspect at_from} at #{inspect from} cannot move to #{inspect at_to} at #{inspect to}"
      true ->
        new_cave_map = Map.put(Map.put(cave_map, to, at_from), from, :open)
        # Moving means that any given position that was previously stuck may not be that anymore
        %Cave{cave | map: new_cave_map, stuck_positions: MapSet.new()}
    end
  end

  def remove_at(cave, pos) do
    new_cave = update_at(cave, pos, :open)
    # Removing means that any given position that was previously stuck may not be that anymore
    %Cave{new_cave | stuck_positions: MapSet.new()}
  end
  def update_at(%Cave{map: map} = cave, pos, at_pos), do: %Cave{cave | map: Map.put(map, pos, at_pos)}

  def print(%Cave{map: map}) do
    max_x = 1 + (map |> Enum.map(fn {{x, _}, _} -> x end) |> Enum.max())
    max_y = 1 + (map |> Enum.map(fn {{_, y}, _} -> y end) |> Enum.max())
    lines = 0..max_y |> Enum.map(fn y ->
      cells = 0..max_x |> Enum.map(fn x ->
        at_pos = map[{x, y}]
        cond do
          #at_pos == :wall -> "#"
          at_pos == nil -> "#"
          at_pos == :open -> "."
          Unit.is?(at_pos, :elf) -> "E"
          Unit.is?(at_pos, :goblin) -> "G"
          true -> raise "Unknown: #{inspect at_pos}"
        end
      end)
      stats = 0..max_x |> Enum.map(fn x ->
        at_pos = map[{x, y}]
        cond do
          at_pos == nil -> "" #:wall -> ""
          at_pos == :open -> ""
          Unit.is?(at_pos, :elf) -> "E(#{at_pos.hit_points})"
          Unit.is?(at_pos, :goblin) -> "G(#{at_pos.hit_points})"
        end
      end) |> Enum.filter(fn s -> String.length(s) > 0 end)


      Enum.join(cells, "") <> "   " <> Enum.join(stats, ", ")
    end)
    Enum.join(lines, "\r\n")
  end
end

defmodule ElfDied do
  defexception message: "elf died"
end

defmodule Day15 do
  def is_less_in_reading_order?({x1, y1}, {x2, y2}), do: y1 < y2 or (y1 == y2 and x1 < x2)

  def part1(lines) do
    cave = Cave.parse(lines, 3)
    {new_cave, full_rounds} = turn(cave, 0, false)
    full_rounds * Cave.sum_hit_points(new_cave)
  end

  def part2(lines) do
    power = find_first_win(lines, 4)
    {win, outcome} = try_power(lines, power)
    if not win, do: raise "Not win???"
    {power, outcome}
  end

  defp find_first_win(lines, elf_power) do
    upper_bound = find_upper_bound(lines, elf_power)
    binary_search(lines, elf_power, upper_bound)
  end

  defp binary_search(_, low, high) when high < low, do: low
  defp binary_search(lines, low, high) do
    mid = div(low + high, 2)
    case try_power(lines, mid) do
      {true, _} -> binary_search(lines, low, mid - 1)
      _         -> binary_search(lines, mid + 1, high)
    end
  end

  defp find_upper_bound(lines, elf_power) do
    case try_power(lines, elf_power) do
      {true, _} -> elf_power
      _         -> find_upper_bound(lines, elf_power * 2)
    end
  end

  defp try_power(lines, elf_power) do
    cave = Cave.parse(lines, elf_power)
    try do
      {new_cave, full_rounds} = turn(cave, 0, true)
      outcome = full_rounds * Cave.sum_hit_points(new_cave)
      {true, outcome}
    rescue
      _ in ElfDied -> {false, -1}
    end
  end

  defp turn(cave, rounds_so_far, throw_on_dead_elf) do
    units = Cave.units(cave)
    unit_types = units |> Enum.map(fn {_, unit} -> unit.type end) |> Enum.uniq()
    if length(unit_types) == 1 do
      # combat ends
      {cave, rounds_so_far}
    else
      {new_cave, aborted} = units |> Enum.reduce_while({cave, false}, fn {unit_pos, unit}, {cave, _} ->
        if Cave.unit_id_at(cave, unit_pos) != unit.id do
          # unit was killed
          {:cont, {cave, false}}
        else
          case unit_turn(unit_pos, unit, cave, throw_on_dead_elf) do
            nil   -> {:halt, {cave, true}}
            other -> {:cont, {other, false}}
          end
        end
      end)
      if aborted do
        # combat ends
        {new_cave, rounds_so_far}
      else
        turn(new_cave, rounds_so_far + 1, throw_on_dead_elf)
      end
    end
  end

  def unit_turn(unit_pos, unit, cave, throw_on_dead_elf) do
    # Need to get units for each unit turn, since units may have moved or been killed recently.
    units = Cave.units(cave)

    enemy_type = if unit.type == :elf, do: :goblin, else: :elf
    target_positions = find_target_positions(units, enemy_type)
    if length(target_positions) == 0 do
      # no more enemies!
      nil
    else
      targets_in_range = find_targets_in_range(target_positions, unit_pos)
      if length(targets_in_range) > 0 do
        attack(cave, unit_pos, targets_in_range, throw_on_dead_elf)
      else
        # Unit moves
        if Cave.is_position_stuck?(cave, unit_pos) do
          cave
        else
          destinations = target_positions
            |> Enum.flat_map(fn p -> Cave.open_positions_adjacent_to_position(cave, p) end)
            |> Enum.uniq()

          reachable_paths = destinations
            |> Enum.map(fn p -> Cave.shortest_path(cave, unit_pos, p) end)
            |> Enum.reject(fn path -> length(path) == 0 end)

          if length(reachable_paths) == 0 do
            # nothing to do
            Cave.remember_stuck_at(cave, unit_pos)
          else
            # the nearest is the one with shortest path (all paths found are of equal length)
            # many may be nearest but we get the first (which should be in reading order)
            path = Enum.min_by(reachable_paths, fn path -> length(path) end)
            chosen_step = hd path
            cave_after_move = Cave.move(cave, unit_pos, chosen_step)

            # can we attack?
            targets_in_range_after_move = find_targets_in_range(target_positions, chosen_step)
            if length(targets_in_range_after_move) > 0 do
              attack(cave_after_move, chosen_step, targets_in_range_after_move, throw_on_dead_elf)
            else
              cave_after_move
            end
          end
        end
      end
    end
  end

  def attack(cave, attacker_pos, target_positions, throw_on_dead_elf) do
    attacker = cave.map[attacker_pos]
    victims = target_positions |> Enum.map(fn pos -> {cave.map[pos], pos} end)
    {chosen_victim, victim_pos} = victims |> Enum.min_by(fn {v, _} -> v.hit_points end)
    victim_after_attack = Unit.take_hit_from(chosen_victim, attacker)
    if Unit.is_dead?(victim_after_attack) do
      if throw_on_dead_elf and victim_after_attack.type == :elf, do: raise ElfDied
      Cave.remove_at(cave, victim_pos)
    else
      Cave.update_at(cave, victim_pos, victim_after_attack)
    end
  end

  defp find_target_positions(units, enemy_type) do
    units
      |> Enum.filter(fn {_, unit} -> Unit.is?(unit, enemy_type) end)
      |> Enum.map(fn {p, _} -> p end)
      |> Enum.uniq()
  end

  defp find_targets_in_range(target_positions, unit_pos) do
    target_positions |> Enum.filter(fn p -> Cave.are_positions_adjacent?(unit_pos, p) end)
  end
end
