defmodule Day2 do

  def part1(input) do
    count_with_2 = input |> Enum.count(fn x -> contains_exactly_letters(x, 2) end)
    count_with_3 = input |> Enum.count(fn x -> contains_exactly_letters(x, 3) end)
    count_with_2 * count_with_3
  end

  defp contains_exactly_letters(x, cnt) do
    chars = to_charlist(x)
    by_freq = Enum.group_by(chars, fn ch -> Enum.count(chars, fn x -> x == ch end) end)
    by_freq[cnt] != nil
  end

  def part2(input) do
    pairs = input |> Enum.flat_map(fn x -> input |> Enum.map(fn y -> { x, y } end) end)
    {a, b} = pairs |> Enum.find(nil, &differ_by_one_char/1)
    t1 = to_charlist(a)
    t2 = to_charlist(b)
    zipped = Enum.zip(t1, t2)
    common = zipped |> Enum.filter(fn {a, b} -> a == b end) |> Enum.map(fn {a, _} -> a end)
    # TODO: interesect_lists doesn't preserve order, fix it!
    #common_chars = Utils.intersect_lists(t1, t2)
    to_string(common)
  end

  defp differ_by_one_char(tup) do
    {a, b} = tup
    chars_a = to_charlist(a)
    chars_b = to_charlist(b)
    zipped = Enum.zip(chars_a, chars_b)
    diff_count = zipped |> Enum.count(fn {x, y} -> x != y end)
    diff_count == 1
  end
end
