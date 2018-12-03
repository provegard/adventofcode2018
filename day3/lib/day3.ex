defmodule Day3 do

  def part1(patches) do
    new_grid = Enum.reduce(patches, %{}, fn patch, grid ->
      {_, left, top, width, height} = patch
      patch_coords = coords(left, top, width, height)
      Enum.reduce(patch_coords, grid, fn coord, g ->
        cur = g[coord]
        counter = if cur == nil, do: 1, else: cur + 1
        Map.put(g, coord, counter)
      end)
    end)

    # count coords where the count is > 1
    result = Enum.count(new_grid, fn {_, v} -> v > 1 end)

    result
  end

  defp coords(left, top, width, height) do
    left..(left + width - 1) |> Enum.flat_map(fn x -> top..(top + height - 1) |> Enum.map(fn y -> {x, y} end) end)
  end

  def part2(patches) do
    new_grid = Enum.reduce(patches, %{}, fn patch, grid ->
      {patch_id, left, top, width, height} = patch
      patch_coords = coords(left, top, width, height)
      Enum.reduce(patch_coords, grid, fn coord, g ->
        # Each cell holds a list of patch_ids
        pids = g[coord]
        new_value = if pids == nil, do: [patch_id], else: pids ++ [patch_id]
        Map.put(g, coord, new_value)
      end)
    end)

    all_patch_ids = patches |> Enum.map(fn p -> elem(p, 0) end) |> MapSet.new
    overlapping_ids = new_grid
      |> Enum.filter(fn {_, v} -> length(v) > 1 end)
      |> Enum.flat_map(fn {_, v} -> v end)
      |> MapSet.new
    standalone_patch_ids = MapSet.difference(all_patch_ids, overlapping_ids)
    MapSet.to_list(standalone_patch_ids)
  end

end
