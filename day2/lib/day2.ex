defmodule Day2 do

  def part1(input) do
    count_with_2 = input |> Enum.count(fn x -> contains_exactly_letters(x, 2) end)
    count_with_3 = input |> Enum.count(fn x -> contains_exactly_letters(x, 3) end)
    count_with_2 * count_with_3
  end

  defp contains_exactly_letters(x, cnt) do
    Utils.by_frequency(to_charlist(x))[cnt] != nil
  end

  def part2(input) do
    # Generete pairs of charlists.
    charlists = input |> Enum.map(&to_charlist/1)
    pairs = charlists
      |> Enum.with_index()
      |> Enum.flat_map(fn {x, idx} -> charlists |> Enum.drop(idx + 1) |> Enum.map(fn y -> { x, y } end) end)

    # Find the first pair where the difference is one character
    {a, b} = pairs |> Enum.find(nil, &differ_by_one_char/1)

    # Find same characters - we cannot use Utils.interesect_lists as it 1) only returns unique
    # characters and 2) doesn't return them in order.
    common = Enum.zip(a, b) |> Enum.filter(fn {a, b} -> a == b end) |> Enum.map(fn {a, _} -> a end)

    to_string(common)
  end

  defp differ_by_one_char({a, b}) do
    diff_count = Enum.zip(a, b) |> Enum.count(fn {x, y} -> x != y end)
    diff_count == 1
  end
end
