defmodule Day1Mix do

  def part1(numbers) do
    numbers |> Enum.sum
  end

  def part2(numbers) do

    # need to use Enum.to_list here, else I get:
    # ** (ArgumentError) cannot cycle over empty enumerable
    inf = Stream.cycle(numbers |> Enum.to_list)

    # Accumulate the sum of elements (frequencies)
    accumulated = inf |> Stream.transform(0, fn i, acc -> {[acc], acc + i} end)

    # Find and return the first duplicate
    accumulated |> Enum.reduce_while(MapSet.new(), fn x, seen ->
      if MapSet.member?(seen, x), do: {:halt, x}, else: {:cont, MapSet.put(seen, x)}
    end)
  end
end
