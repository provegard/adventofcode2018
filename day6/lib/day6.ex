defmodule Day6 do

  def part2(coordinates, upper_bound) do
    bounds = find_bounds(coordinates)
    map_coords = for x <- (bounds[:left])..(bounds[:right]), y <- (bounds[:top])..(bounds[:bottom]), do: {x, y}

    map_coords_with_less_dist = Enum.filter(map_coords, fn c ->
      total_dist_to_all = coordinates
        |> Enum.map(fn x -> manhattan(x, c) end)
        |> Enum.sum()
      total_dist_to_all < upper_bound
    end)

    Enum.count(map_coords_with_less_dist)
  end

  def part1(coordinates) do
    bounds = find_bounds(coordinates)

    map = mark(coordinates, bounds)

    # coords with finite area didn't "leak" outside the bounds
    coords_with_inf_area = map
      |> Enum.filter(fn {k, _}-> is_outside(bounds, k) end)
      |> Enum.map(fn {_, v} -> v end)
      |> MapSet.new()

    coord_set = MapSet.new(coordinates)
    coords_with_finite_area = MapSet.difference(coord_set, coords_with_inf_area)

    # each coord in the map (within the bounds) is now marked with one of
    # the "main" coordinates.
    # for each inner, count the number of places where it is marked
    areas = coords_with_finite_area |> Enum.map(fn inner ->
      Map.values(map) |> Enum.count(fn v -> v == inner end)
    end)

    Enum.max(areas)
  end

  defp is_outside(bounds, {x, y}) do
    x < bounds[:left] ||
      x > bounds[:right] ||
      y < bounds[:top] ||
      y > bounds[:bottom]
  end

  defp mark(all, bounds) do
    # Mark one outside the bounds, to detect infinite areas
    map_coords = for x <- (bounds[:left]-1)..(bounds[:right]+1), y <- (bounds[:top]-1)..(bounds[:bottom]+1), do: {x, y}
    map_coords |> Enum.reduce(%{}, fn {x, y}, map ->
      c = {x, y}
      # find distance from c to each coord
      # [{coord, dist}, ...]
      distances = all |> Enum.map(fn x ->
        dist = manhattan(x, c)
        {x, dist}
      end)
      {_, min_dist} = distances |> Enum.min_by(fn {_, dist} -> dist end)
      # if there are multiple with the min_dist, then we have a tie
      # otherwise mark with the coordinate of the winner
      all_with_min_dist = distances |> Enum.filter(fn {_, dist} -> dist == min_dist end)
      if length(all_with_min_dist) == 1 do
        {winner, _} = hd all_with_min_dist
        Map.put(map, c, winner)
      else
        # tie, don't mark
        map
      end
    end)
  end

  defp find_bounds(coordinates) do
    coordinates |> Enum.reduce(%{}, fn {x, y}, acc ->
      left = min_of(acc[:left], x)
      right = max_of(acc[:right], x)
      top = min_of(acc[:top], y)
      bottom = max_of(acc[:bottom], y)
      %{:left => left, :right => right, :bottom => bottom, :top => top}
    end)
  end

  defp min_of(cur, x), do: if cur == nil, do: x, else: min(cur, x)
  defp max_of(cur, x), do: if cur == nil, do: x, else: max(cur, x)
  defp manhattan({x, y}, {u, v}), do: abs(x - u) + abs(y - v)
end
