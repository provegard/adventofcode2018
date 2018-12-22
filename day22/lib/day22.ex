defmodule Day22 do

  defp geologic_index_at(_, {0, 0}, _, grid), do: {0, grid}
  defp geologic_index_at(depth, pos, target, grid) do
    cached = grid[pos]
    if cached != nil do
      {cached, grid}
    else
      case pos do
        ^target -> {0, grid}
        {x, 0}  -> {x * 16807, grid}
        {0, y}  -> {y * 48271, grid}
        {x, y}  ->
          {e1, grid2} = erosion_level_at(depth, {x - 1, y}, target, grid)
          {e2, grid3} = erosion_level_at(depth, {x, y - 1}, target, grid2)
          geo_idx = e1 * e2
          # cache this
          new_grid = Map.put(grid3, pos, geo_idx)
          {geo_idx, new_grid}
      end
    end
  end

  defp erosion_level_at(depth, pos, target, grid) do
    {geo_idx, new_grid} = geologic_index_at(depth, pos, target, grid)
    level = rem(geo_idx + depth, 20183)
    {level, new_grid}
  end

  defp type(ero_level) do
    case rem(ero_level, 3) do
      0 -> :rocky
      1 -> :wet
      2 -> :narrow
    end
  end

  defp risk(:rocky), do: 0
  defp risk(:wet), do: 1
  defp risk(:narrow), do: 2

  defp calc_risk(depth, {tx, ty}=target) do
    positions = for x <- 0..tx, y <- 0..ty, do: {x, y}
    {sum, _ } = positions |> Enum.reduce({0, %{}}, fn pos, {sum, grid} ->
      {level, new_grid} = erosion_level_at(depth, pos, target, grid)
      r = risk(type(level))
      {sum + r, new_grid}
    end)
    sum
  end

  def part1(depth, target) do
    calc_risk(depth, target)
  end
end
