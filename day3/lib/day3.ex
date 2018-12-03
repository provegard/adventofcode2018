defmodule Day3 do

  def part1(patches) do
    # Expand all patch coordinates, {x, y}
    patch_coords = patches |> Enum.flat_map(fn patch ->
      {_, left, top, width, height} = patch
      coords(left, top, width, height)
    end)

    # Group by coordinate and count groups where a coordinate occurs more than one time.
    # The coordinate of such a group is overlapped by more than one patch.
    patch_coords
      |> Enum.group_by(fn c -> c end)
      |> Enum.filter(fn {_, v} -> length(v) > 1 end)
      |> length
  end

  defp coords(left, top, width, height) do
    for x <- left..(left + width - 1), y <- top..(top + height - 1), do: {x, y}
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
