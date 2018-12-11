defmodule Day11 do

  def power_level(x, y, serial) do
    rack_id = x + 10
    level = rack_id * (rack_id * y + serial)
    level = rem(div(level, 100), 10)
    level - 5
  end

  defp create_power_map(serial) do
    coords = for x <- 1..300, y <- 1..300, do: {x, y}
    coords |> Enum.map(fn {x, y} -> {{x, y}, power_level(x, y, serial)} end) |> Map.new()
  end

  def part1(serial) do
    top_lefts = for x <- 1..298, y <- 1..298, do: {x, y}
    powers = create_power_map(serial)
    top_lefts |> Enum.map(fn {x, y} -> find_power(x, y, 3, powers) end) |> Enum.max_by(fn {_, _, p} -> p end)
  end

  defp find_power(a, b, size, power_map) do
    coords = for x <- a..(a+(size-1)), y <- b..(b+(size-1)), do: {x, y}
    total_power = coords |> Enum.reduce(0, fn c, sum -> sum + power_map[c] end)
    {a, b, total_power}
  end

  def part2(serial) do
    powers = create_power_map(serial)
    1..300 |> Enum.to_list() |> Enum.map(fn size ->
      top_lefts = for x <- 1..(301-size), y <- 1..(301-size), do: {x, y}
      # find largest of this size
      {x, y, p} = top_lefts |> Enum.map(fn {x, y} -> find_power(x, y, size, powers) end) |> Enum.max_by(fn {_, _, p} -> p end)
      {x, y, size, p}
    end) |> Enum.max_by(fn {_, _, _, p} -> p end)
  end
end
