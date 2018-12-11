defmodule Day11 do

  def power_level(x, y, serial) do
    rack_id = x + 10
    level = rack_id * (rack_id * y + serial)
    level = rem(div(level, 100), 10)
    level - 5
  end

  def part1(serial) do
    top_lefts = for x <- 1..298, y <- 1..298, do: {x, y}
    top_lefts |> Enum.map(fn {x, y} -> find_power(x, y, 3, serial) end) |> Enum.max_by(fn {_, _, p} -> p end)
  end

  defp find_power(a, b, size, serial) do
    coords = for x <- a..(a+(size-1)), y <- b..(b+(size-1)), do: {x, y}
    total_power = coords |> Enum.reduce(0, fn {x, y}, sum -> sum + power_level(x, y, serial) end)
    {a, b, total_power}
  end

  defp create_power_map(coords, serial) do
    coords |> Enum.map(fn {x, y} -> {{x, y}, power_level(x, y, serial)} end) |> Map.new()
  end

  def part2(serial) do
    coords = for x <- 1..300, y <- 1..300, do: {x, y}
    power_map = create_power_map(coords, serial)

    coords |> Enum.map(fn {x, y} ->
      IO.inspect {x, y}

      # for each point, generate a stream of results for each grid size
      max_size = min(301 - x, 301 - y)
      {size_power, _} = 1..max_size |> Enum.map_reduce(0, fn size, prev_power ->
        # generate for coords:
        # ..#
        # ..#
        # ###
        y_edge_coords = for y_ <- y..(y+size-1), do: {x+size-1, y_}
        x_edge_coords = for x_ <- x..(x+size-1), do: {x_, y+size-1}
        all = x_edge_coords ++ y_edge_coords |> Enum.uniq()
        power_sum = all |> Enum.reduce(0, fn c, sum -> sum + power_map[c] end)
        this_power = power_sum + prev_power
        {{size, this_power}, this_power} # {result, accumulator}
      end)
      IO.inspect length(size_power)
      {size, power} = Enum.max_by(size_power, fn {_, power} -> power end)
      {x, y, size, power}
    end) |> Enum.max_by(fn {_, _, _, p} -> p end)
  end
end
