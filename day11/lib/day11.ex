defmodule Day11 do

  def power_level(x, y, serial) do
    rack_id = x + 10
    level = rack_id * (rack_id * y + serial)
    level = rem(div(level, 100), 10)
    level - 5
  end

  def part1(serial) do
    top_lefts = for x <- 1..298, y <- 1..298, do: {x, y}
    top_lefts |> Enum.map(fn {x, y} ->  find_power(x, y, serial) end) |> Enum.max_by(fn {_, _, p} -> p end)
  end

  defp find_power(a, b, serial) do
    coords = for x <- a..(a+2), y <- b..(b+2), do: {x, y}
    total_power = coords |> Enum.reduce(0, fn {x, y}, sum -> sum + power_level(x, y, serial) end)
    {a, b, total_power}
  end

  def part2(input) do
    :world
  end
end
