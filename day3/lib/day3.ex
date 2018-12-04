defmodule Day3 do

  def part1(patches) do
    # Expand all patch coordinates, {x, y}
    all_coords = patches |> Enum.flat_map(&patch_coords/1)

    # Group by coordinate and count groups where a coordinate occurs more than one time.
    # The coordinate of such a group is overlapped by more than one patch.
    all_coords
      |> Enum.group_by(fn {_, x, y} -> {x, y} end)
      |> Enum.filter(fn {_, v} -> length(v) > 1 end)
      |> length
  end

  defp patch_coords({id, left, top, width, height}) do
    coords(left, top, width, height) |> Enum.map(fn {x, y} -> {id, x, y} end)
  end

  defp coords(left, top, width, height) do
    for x <- left..(left + width - 1), y <- top..(top + height - 1), do: {x, y}
  end

  def part2(patches) do
    all_patch_ids = patches |> Enum.map(fn p -> elem(p, 0) end) |> MapSet.new()

    # Expand ID + patch coordinates, {id, x, y}
    all_coords_with_id = patches |> Enum.flat_map(&patch_coords/1)

    # Group by coordinate and find patch IDs that occur in cells where patches
    # overlap.
    overlapping_patch_ids = all_coords_with_id
      |> Enum.group_by(fn {_, x, y} -> {x, y} end, fn {id, _, _} -> id end)
      |> Enum.filter(fn {_, v} -> length(v) > 1 end)
      |> Enum.flat_map(fn {_, v} -> v end)
      |> MapSet.new()

    # Remove overlapping patch IDs from all; the ones left don't overlap.
    MapSet.difference(all_patch_ids, overlapping_patch_ids)
      |> MapSet.to_list()
  end

end
